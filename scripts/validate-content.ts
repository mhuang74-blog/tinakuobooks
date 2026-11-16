import fs from 'node:fs'
import path from 'node:path'
import matter from 'gray-matter'
import { isCollectionId } from '@/content/collections'
import { isAuthorId } from '@/content/authors'
import { getAllWorks } from '@/lib/works'

const ROOT = process.cwd()
const WORKS_ROOT = path.join(ROOT, 'content', 'works')
const ZH_DIR = path.join(WORKS_ROOT, 'zh')
const EN_DIR = path.join(WORKS_ROOT, 'en')

const errors: string[] = []
const warnings: string[] = []

const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/
const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/
const MARKDOWN = /\.md$/

function listMarkdown(directory: string): string[] {
  if (!fs.existsSync(directory)) return []
  return fs.readdirSync(directory).filter((file) => MARKDOWN.test(file)).sort()
}

function isValidDate(value: unknown): boolean {
  if (typeof value !== 'string' || !DATE_PATTERN.test(value)) return false
  const parsed = new Date(`${value}T00:00:00Z`)
  return !Number.isNaN(parsed.getTime()) && parsed.toISOString().startsWith(value)
}

function checkBody(label: string, body: string): void {
  if (body.includes('<!--more-->')) errors.push(`${label}: body still contains <!--more-->`)
  if (body.includes('assets/images/')) errors.push(`${label}: body references assets/images/`)
}

const zhFiles = listMarkdown(ZH_DIR)
const enFiles = listMarkdown(EN_DIR)

if (zhFiles.length === 0) errors.push('content/works/zh is empty')

const enByLegacySlug = new Map(enFiles.map((file) => [file.replace(MARKDOWN, ''), file]))

const seenSlugEn = new Map<string, string>()
let featuredCount = 0

for (const file of zhFiles) {
  const legacySlug = file.replace(MARKDOWN, '')
  const label = `content/works/zh/${file}`
  const parsed = matter(fs.readFileSync(path.join(ZH_DIR, file), 'utf8'))
  const data = parsed.data as Record<string, unknown>

  if (typeof data.title !== 'string' || !data.title.trim()) errors.push(`${label}: missing title`)
  if (typeof data.description !== 'string' || !data.description.trim()) {
    errors.push(`${label}: missing description`)
  }
  if (!isValidDate(data.date)) errors.push(`${label}: invalid or missing date (${String(data.date)})`)
  if (typeof data.author !== 'string' || !isAuthorId(data.author)) {
    errors.push(`${label}: unknown author (${String(data.author)})`)
  }
  if (typeof data.collection !== 'string' || !isCollectionId(data.collection)) {
    errors.push(`${label}: unknown collection (${String(data.collection)})`)
  }
  if (typeof data.cover !== 'string' || !data.cover.startsWith('/')) {
    errors.push(`${label}: cover must be an absolute public path`)
  } else if (!fs.existsSync(path.join(ROOT, 'public', data.cover))) {
    errors.push(`${label}: cover file not found in public: ${data.cover}`)
  }
  if (data.slug !== undefined) errors.push(`${label}: Chinese works must not define a slug`)
  if (data.featured === true) featuredCount += 1

  checkBody(label, parsed.content)

  const enFile = enByLegacySlug.get(legacySlug)
  if (!enFile) {
    warnings.push(`${label}: no English translation yet (slugEn empty)`)
    continue
  }

  const enLabel = `content/works/en/${enFile}`
  const enParsed = matter(fs.readFileSync(path.join(EN_DIR, enFile), 'utf8'))
  const enData = enParsed.data as Record<string, unknown>
  const slugEn = typeof enData.slug === 'string' ? enData.slug.trim() : ''

  if (!slugEn) errors.push(`${enLabel}: missing slug`)
  else if (!SLUG_PATTERN.test(slugEn)) errors.push(`${enLabel}: invalid slug (${slugEn})`)
  else {
    const duplicate = seenSlugEn.get(slugEn)
    if (duplicate) errors.push(`${enLabel}: duplicate slug ${slugEn} (also in ${duplicate})`)
    else seenSlugEn.set(slugEn, label)
  }

  if (typeof enData.title !== 'string' || !enData.title.trim()) {
    errors.push(`${enLabel}: missing title`)
  }
  if (typeof enData.description !== 'string' || !enData.description.trim()) {
    errors.push(`${enLabel}: missing description`)
  }
  if (!enParsed.content.trim()) warnings.push(`${enLabel}: English body is empty`)

  checkBody(enLabel, enParsed.content)
}

for (const enFile of enFiles) {
  const legacySlug = enFile.replace(MARKDOWN, '')
  if (!zhFiles.includes(`${legacySlug}.md`)) {
    warnings.push(`content/works/en/${enFile}: no matching Chinese work`)
  }
}

if (featuredCount > 1) errors.push(`${featuredCount} works are marked featured; expected at most 1`)

const works = getAllWorks()
const pending = works.filter((work) => work.translationPending)
const featured = works.find((work) => work.featured)

for (const warning of warnings) console.warn(`warn  ${warning}`)
for (const error of errors) console.error(`error ${error}`)

console.log(
  `content: ${works.length} works, ${pending.length} translation-pending, featured: ${featured?.slug ?? 'none'}`,
)

if (errors.length > 0) {
  console.error(`Content validation failed with ${errors.length} error(s).`)
  process.exit(1)
}

import fs from 'node:fs'
import path from 'node:path'

const ROOT = process.cwd()
const OUT = path.join(ROOT, 'out')
const SITE = 'www.tinakuobooks.com'

if (!fs.existsSync(OUT)) {
  console.error('postbuild: out/ is missing; run next build first')
  process.exit(1)
}

function moveToIndexDirectory(htmlPath) {
  const directory = htmlPath.replace(/\.html$/, '')
  fs.mkdirSync(directory, { recursive: true })
  fs.renameSync(htmlPath, path.join(directory, 'index.html'))
  return `${path.relative(OUT, htmlPath)} -> ${path.relative(OUT, path.join(directory, 'index.html'))}`
}

const moved = []

// Next exports percent-encoded duplicates for non-ASCII dynamic params
// (both the raw and the encoded form are needed at build time). The real
// public URLs are the raw Chinese filenames, so drop the encoded copies.
const encodedName = /%[0-9A-Fa-f]{2}/
for (const entry of fs.readdirSync(OUT, { withFileTypes: true })) {
  if (!encodedName.test(entry.name)) continue
  fs.rmSync(path.join(OUT, entry.name), { recursive: true, force: true })
}

const aboutHtml = path.join(OUT, 'about.html')
if (fs.existsSync(aboutHtml)) moved.push(moveToIndexDirectory(aboutHtml))

for (const group of ['tag', 'author']) {
  const directory = path.join(OUT, group)
  if (!fs.existsSync(directory)) continue
  for (const file of fs.readdirSync(directory)) {
    if (!file.endsWith('.html')) continue
    moved.push(moveToIndexDirectory(path.join(directory, file)))
  }
}

// Next writes an RSC payload directory next to every exported page, e.g.
// `works.html` beside `works/__next*.txt`. On a static host a request for
// `/works` may resolve to the directory first; without an index.html that is a
// 404. Copy the page into the directory so both lookup orders work, and keep the
// original flat HTML (that is what the flat legacy URLs rely on).
const copied = []
function fillPayloadDirectories(start) {
  for (const entry of fs.readdirSync(start, { withFileTypes: true })) {
    const full = path.join(start, entry.name)
    if (entry.isDirectory()) {
      fillPayloadDirectories(full)
      continue
    }
    if (!entry.name.endsWith('.html')) continue
    const base = full.slice(0, -'.html'.length)
    if (!fs.existsSync(base) || !fs.statSync(base).isDirectory()) continue
    if (entry.name === '404.html' || entry.name === '_not-found.html') continue
    const index = path.join(base, 'index.html')
    if (fs.existsSync(index)) continue
    fs.copyFileSync(full, index)
    copied.push(path.relative(OUT, index))
  }
}
fillPayloadDirectories(OUT)

fs.writeFileSync(path.join(OUT, '.nojekyll'), '')
fs.writeFileSync(path.join(OUT, 'CNAME'), `${SITE}\n`)

const notFoundPath = path.join(OUT, '404.html')
if (!fs.existsSync(notFoundPath)) {
  throw new Error('postbuild: out/404.html was not exported')
}
if (!fs.readFileSync(notFoundPath, 'utf8').includes('data-custom-404')) {
  throw new Error('postbuild: out/404.html does not contain the custom 404 marker')
}

const workSlugs = fs
  .readdirSync(path.join(ROOT, 'content', 'works', 'zh'))
  .filter((file) => file.endsWith('.md'))
  .map((file) => file.replace(/\.md$/, ''))

// Next also emits per-route RSC payloads next to the HTML: `<slug>.txt` and a
// `<slug>/` directory. A directory named like the work shadows the extensionless
// URL on GitHub Pages, and the Chinese tree navigates with full page loads, so
// both are dead weight. Keep only `<slug>.html`.
for (const slug of workSlugs) {
  fs.rmSync(path.join(OUT, `${slug}.txt`), { force: true })
  fs.rmSync(path.join(OUT, slug), { recursive: true, force: true })
}

const missingWorks = workSlugs.filter(
  (slug) => !fs.existsSync(path.join(OUT, `${slug}.html`)),
)
if (missingWorks.length > 0) {
  throw new Error(`postbuild: missing work pages: ${missingWorks.join(', ')}`)
}

const leftovers = fs
  .readdirSync(OUT)
  .filter((name) => encodedName.test(name) || workSlugs.some((slug) => name === slug))
if (leftovers.length > 0) {
  throw new Error(`postbuild: encoded or directory duplicates remain: ${leftovers.join(', ')}`)
}

const shadowed = []
function assertNoShadowedRoutes(start) {
  for (const entry of fs.readdirSync(start, { withFileTypes: true })) {
    const full = path.join(start, entry.name)
    if (entry.isDirectory()) {
      assertNoShadowedRoutes(full)
      continue
    }
    if (!entry.name.endsWith('.html')) continue
    const base = full.slice(0, -'.html'.length)
    if (!fs.existsSync(base) || !fs.statSync(base).isDirectory()) continue
    if (entry.name === '404.html' || entry.name === '_not-found.html') continue
    if (!fs.existsSync(path.join(base, 'index.html'))) shadowed.push(path.relative(OUT, base))
  }
}
assertNoShadowedRoutes(OUT)
if (shadowed.length > 0) {
  throw new Error(`postbuild: directories without index.html shadow routes: ${shadowed.join(', ')}`)
}

function countFiles(start, predicate) {
  if (!fs.existsSync(start)) return 0
  return fs.readdirSync(start, { withFileTypes: true }).reduce((total, entry) => {
    const full = path.join(start, entry.name)
    if (entry.isDirectory()) return total + countFiles(full, predicate)
    return total + (predicate(entry.name) ? 1 : 0)
  }, 0)
}

const feedCount = countFiles(OUT, (name) => name === 'feed.xml' || name === 'atom.xml')

console.log(`postbuild: moved ${moved.length} routes, filled ${copied.length} payload directories`)
for (const line of moved) console.log(`  ${line}`)
console.log(`postbuild: ${workSlugs.length} work pages, ${feedCount} feed files`)
console.log(`postbuild: wrote .nojekyll and CNAME (${SITE})`)

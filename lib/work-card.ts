import type { CollectionId } from '@/content/collections'
import type { Locale } from '@/lib/i18n'
import { workHref } from '@/lib/i18n'
import type { Work } from '@/lib/works'
import { getAuthor } from '@/content/authors'
import { getCollection } from '@/content/collections'

export type WorkCardData = {
  slug: string
  href: string
  title: string
  description: string
  cover: string
  date: string
  readingMinutes: number
  collectionId: CollectionId
  collectionName: string
  collectionAccent: string
  authorName: string
}

export function toWorkCardData(work: Work, locale: Locale): WorkCardData {
  const collection = getCollection(work.collectionId)
  const author = getAuthor(work.authorId)

  return {
    slug: work.slug,
    href: workHref(locale, work),
    title: work.title[locale],
    description: work.description[locale],
    cover: work.cover,
    date: work.date,
    readingMinutes: work.readingMinutes[locale],
    collectionId: work.collectionId,
    collectionName: collection.name[locale],
    collectionAccent: collection.accent,
    authorName: author.name[locale],
  }
}

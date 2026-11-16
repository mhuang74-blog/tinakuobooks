import { expect, test } from '@playwright/test'

test.describe('Chinese site', () => {
  test('home shows the featured work and six latest works', async ({ page }) => {
    const response = await page.goto('/')
    expect(response?.status()).toBe(200)

    await expect(
      page.getByRole('heading', { level: 1, name: '讓故事延伸下去' }),
    ).toBeVisible()
    await expect(
      page.getByRole('heading', { name: '57號小豹', exact: true }),
    ).toBeVisible()

    const latest = page.locator('section[aria-label="最新作品"] article')
    await expect(latest).toHaveCount(6)
  })

  test('works index searches, filters, sorts, and syncs the URL', async ({ page }) => {
    await page.goto('/works')

    const status = page.getByRole('status')
    const search = page.getByLabel('搜尋作品')
    await expect(page.locator('main article')).toHaveCount(11)

    await search.fill('豹')
    await expect(status).toHaveText('2 件作品')
    await expect(page).toHaveURL(/\/works\?q=%E8%B1%B9$/)
    await expect(page.locator('main article')).toHaveCount(2)

    await page.getByRole('button', { name: '清除篩選' }).click()
    await expect(status).toHaveText('11 件作品')

    await page.getByRole('button', { name: /繪本/ }).click()
    await expect(status).toHaveText('1 件作品')
    await expect(page.locator('main article')).toHaveCount(1)
    await expect(page).toHaveURL(/collection=picture-book/)

    await page.getByLabel('排序').selectOption('title')
    await expect(page).toHaveURL(/sort=title/)

    await page.getByRole('button', { name: '全部' }).click()
    await expect(status).toHaveText('11 件作品')
    await expect(page.locator('main article')).toHaveCount(11)
  })

  test('work page links to its English counterpart', async ({ page }) => {
    await page.goto('/57號小豹')
    await expect(
      page.getByRole('heading', { level: 1, name: '57號小豹' }),
    ).toBeVisible()

    await page.getByRole('link', { name: '切換到英文版' }).click()
    await expect(page).toHaveURL(/\/en\/works\/little-leopard-no-57$/)
    await expect(
      page.getByRole('heading', { level: 1, name: 'Little Leopard No. 57' }),
    ).toBeVisible()
  })

  test('legacy trailing-slash routes keep working', async ({ page }) => {
    const pictureBook = await page.goto('/tag/picture-book/')
    expect(pictureBook?.status()).toBe(200)
    await expect(page.locator('main article')).toHaveCount(1)

    const author = await page.goto('/author/tina/')
    expect(author?.status()).toBe(200)
    await expect(page.locator('main article')).toHaveCount(10)

    const about = await page.goto('/about/')
    expect(about?.status()).toBe(200)
    await expect(page.getByRole('heading', { level: 1, name: '關於' })).toBeVisible()
  })

  test('custom 404 page renders', async ({ page }) => {
    const response = await page.goto('/404')
    expect(response?.status()).toBe(200)
    await expect(page.locator('[data-custom-404]')).toBeVisible()
    await expect(
      page.getByRole('heading', { level: 1, name: '找不到頁面' }),
    ).toBeVisible()
  })

  test('subscribe dialog opens, contains the Mailchimp form, and closes on Escape', async ({
    page,
  }) => {
    await page.goto('/')

    await page.getByRole('button', { name: '訂閱', exact: true }).click()
    const dialog = page.getByRole('dialog', { name: '訂閱新作品通知' })
    await expect(dialog).toBeVisible()
    await expect(dialog.locator('form[action*="list-manage"]')).toBeVisible()
    await expect(dialog.locator('input[name^="b_"]')).toHaveCount(1)

    await page.keyboard.press('Escape')
    await expect(dialog).toBeHidden()
  })

  test('mobile menu keeps focus inside and restores it on Escape', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 })
    await page.goto('/')

    const trigger = page.getByRole('button', { name: '開啟選單' })
    await trigger.click()
    const dialog = page.getByRole('dialog', { name: '選單' })
    await expect(dialog).toBeVisible()
    await expect(dialog.getByRole('button', { name: '關閉選單' })).toBeFocused()

    await page.keyboard.press('Shift+Tab')
    expect(
      await page.evaluate(() => {
        const panel = document.querySelector('#mobile-menu')
        const focusables = panel
          ? [...panel.querySelectorAll<HTMLElement>('a[href], button:not([disabled])')]
          : []
        return panel?.contains(document.activeElement) &&
          document.activeElement === focusables[focusables.length - 1]
      }),
    ).toBe(true)

    await page.keyboard.press('Tab')
    await expect(dialog.getByRole('button', { name: '關閉選單' })).toBeFocused()

    await page.keyboard.press('Escape')
    await expect(dialog).toBeHidden()
    await expect(trigger).toBeFocused()
  })
})

test.describe('English site', () => {
  test('works index searches and filters', async ({ page }) => {
    await page.goto('/en/works')

    const status = page.getByRole('status')
    const search = page.getByLabel('Search works')
    await expect(page.locator('main article')).toHaveCount(11)

    await search.fill('leopard')
    await expect(status).toHaveText('2 works')
    await expect(page.locator('main article')).toHaveCount(2)

    await page.getByRole('button', { name: 'Clear filters' }).click()
    await page.getByRole('button', { name: /Picture Book/ }).click()
    await expect(status).toHaveText('1 work')
    await expect(page.locator('main article')).toHaveCount(1)
  })

  test('about page renders in English', async ({ page }) => {
    const response = await page.goto('/en/about')
    expect(response?.status()).toBe(200)
    await expect(page.getByRole('heading', { level: 1, name: 'About' })).toBeVisible()
  })
})

test.describe('Feeds and sitemap', () => {
  test('feeds and sitemap respond with the expected content', async ({ request }) => {
    const atom = await request.get('/feed.xml')
    expect(atom.status()).toBe(200)
    expect(atom.headers()['content-type']).toContain('xml')
    expect(await atom.text()).toContain('57號小豹')

    const rss = await request.get('/atom.xml')
    expect(rss.status()).toBe(200)
    expect(rss.headers()['content-type']).toContain('xml')
    expect(await rss.text()).toContain('57號小豹')

    const enFeed = await request.get('/en/feed.xml')
    expect(enFeed.status()).toBe(200)
    expect(await enFeed.text()).toContain('Little Leopard No. 57')

    const sitemap = await request.get('/sitemap.xml')
    expect(sitemap.status()).toBe(200)
    const sitemapText = await sitemap.text()
    expect(sitemapText).toContain(
      'https://www.tinakuobooks.com/en/works/little-leopard-no-57',
    )
    expect(sitemapText).toContain(
      'https://www.tinakuobooks.com/57%E8%99%9F%E5%B0%8F%E8%B1%B9',
    )

    const robots = await request.get('/robots.txt')
    expect(robots.status()).toBe(200)
    expect(await robots.text()).toContain('Sitemap:')
  })
})

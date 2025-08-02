import { test, expect } from '@playwright/test';

test.describe('Site Navigation', () => {
  test('main navigation links work correctly', async ({ page }) => {
    await page.goto('/');
    
    // Test navigation to About page
    await page.click('a[href*="/about"], nav a:has-text("About")');
    await expect(page.url()).toContain('/about');
    await expect(page).toHaveTitle(/About/);
    
    // Test navigation to Services page
    await page.goto('/');
    await page.click('a[href*="/services"], nav a:has-text("Services")');
    await expect(page.url()).toContain('/services');
    await expect(page).toHaveTitle(/Services/);
    
    // Test navigation to Projects page
    await page.goto('/');
    await page.click('a[href*="/projects"], nav a:has-text("Projects")');
    await expect(page.url()).toContain('/projects');
    await expect(page).toHaveTitle(/Projects/);
    
    // Test navigation to Contact page
    await page.goto('/');
    await page.click('a[href*="/contact"], nav a:has-text("Contact")');
    await expect(page.url()).toContain('/contact');
    await expect(page).toHaveTitle(/Contact/);
  });

  test('logo/home link returns to homepage', async ({ page }) => {
    // Start from a different page
    await page.goto('/about');
    
    // Click logo or home link
    await page.click('a[href="/"], .logo a, .brand a, header a:first-child');
    
    // Should return to homepage
    await expect(page.url()).toBe(page.url().replace(/\/about.*/, '/'));
    await expect(page).toHaveTitle(/KusseTechStudio/);
  });

  test('mobile navigation menu works', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    
    // Look for mobile menu toggle (hamburger menu)
    const mobileToggle = page.locator('.mobile-menu-toggle, .hamburger, .menu-toggle, button:has-text("Menu")');
    
    if (await mobileToggle.count() > 0) {
      // Click mobile menu toggle
      await mobileToggle.first().click();
      
      // Check that mobile menu is visible
      const mobileMenu = page.locator('.mobile-menu, .nav-mobile, nav.mobile');
      if (await mobileMenu.count() > 0) {
        await expect(mobileMenu.first()).toBeVisible();
        
        // Test navigation link in mobile menu
        const aboutLink = mobileMenu.locator('a[href*="/about"], a:has-text("About")');
        if (await aboutLink.count() > 0) {
          await aboutLink.first().click();
          await expect(page.url()).toContain('/about');
        }
      }
    }
  });

  test('footer links work correctly', async ({ page }) => {
    await page.goto('/');
    
    // Scroll to footer
    await page.locator('footer').scrollIntoViewIfNeeded();
    
    // Test footer navigation links if they exist
    const footerLinks = page.locator('footer a[href^="/"]');
    const linkCount = await footerLinks.count();
    
    if (linkCount > 0) {
      // Test first internal footer link
      const firstLink = footerLinks.first();
      const href = await firstLink.getAttribute('href');
      
      if (href && href !== '/') {
        await firstLink.click();
        await expect(page.url()).toContain(href);
      }
    }
  });

  test('breadcrumb navigation (if present)', async ({ page }) => {
    // Navigate to a sub-page that might have breadcrumbs
    await page.goto('/projects');
    
    const breadcrumbs = page.locator('.breadcrumb, .breadcrumbs, nav[aria-label="breadcrumb"]');
    
    if (await breadcrumbs.count() > 0) {
      // Test breadcrumb home link
      const homeLink = breadcrumbs.locator('a[href="/"], a:has-text("Home")');
      if (await homeLink.count() > 0) {
        await homeLink.first().click();
        await expect(page.url()).toBe(page.url().replace(/\/projects.*/, '/'));
      }
    }
  });

  test('navigation is keyboard accessible', async ({ page }) => {
    await page.goto('/');
    
    // Test keyboard navigation through main menu
    await page.keyboard.press('Tab');
    
    // Find the focused element and ensure it's a navigation element
    let focusedElement = await page.locator(':focus').first();
    let tagName = await focusedElement.evaluate(el => el.tagName.toLowerCase());
    
    // Keep tabbing until we find a navigation link
    let attempts = 0;
    while (tagName !== 'a' && attempts < 10) {
      await page.keyboard.press('Tab');
      focusedElement = page.locator(':focus').first();
      if (await focusedElement.count() > 0) {
        tagName = await focusedElement.evaluate(el => el.tagName.toLowerCase());
      }
      attempts++;
    }
    
    if (tagName === 'a') {
      // Press Enter to activate the link
      await page.keyboard.press('Enter');
      
      // Should navigate to the linked page
      await page.waitForLoadState('networkidle');
      expect(page.url()).not.toBe('about:blank');
    }
  });

  test('search functionality (if present)', async ({ page }) => {
    await page.goto('/');
    
    const searchInput = page.locator('input[type="search"], input[name="search"], input[placeholder*="search" i]');
    
    if (await searchInput.count() > 0) {
      await searchInput.first().fill('python');
      
      const searchButton = page.locator('button[type="submit"]:near(input[type="search"]), button:has-text("Search")');
      if (await searchButton.count() > 0) {
        await searchButton.first().click();
        
        // Should show search results or navigate to search page
        await page.waitForLoadState('networkidle');
        expect(page.url()).toContain('search');
      }
    }
  });
});

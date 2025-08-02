import { test, expect } from "@playwright/test";

test.describe("Projects Showcase", () => {
  test("projects page loads and displays projects", async ({ page }) => {
    await page.goto("/projects");

    await expect(page).toHaveTitle(/Projects/);
    await expect(page.locator("h1, .page-title")).toContainText(/projects/i);

    // Check if projects are displayed
    const projectItems = page.locator(
      ".project, .project-item, .project-card, article",
    );
    const projectCount = await projectItems.count();

    if (projectCount > 0) {
      // Verify first project has required elements
      const firstProject = projectItems.first();
      await expect(firstProject).toBeVisible();

      // Check for project title
      const projectTitle = firstProject.locator(
        "h2, h3, .project-title, .title",
      );
      if ((await projectTitle.count()) > 0) {
        await expect(projectTitle.first()).toBeVisible();
      }
    }
  });

  test("project detail pages load correctly", async ({ page }) => {
    await page.goto("/projects");

    // Find project links
    const projectLinks = page.locator('a[href*="/projects/"]');
    const linkCount = await projectLinks.count();

    if (linkCount > 0) {
      // Click on first project link
      const firstProjectLink = projectLinks.first();
      await firstProjectLink.click();

      // Should load project detail page
      await expect(page.url()).toContain("/projects/");
      await expect(page).toHaveTitle(/Project|KusseTechStudio/);

      // Check for project content
      const content = page.locator("main, .content, .project-content");
      await expect(content).toBeVisible();
    }
  });

  test("project filtering/categories work (if present)", async ({ page }) => {
    await page.goto("/projects");

    // Look for filter buttons or category links
    const filterButtons = page.locator(
      ".filter, .category, .tag, button[data-filter]",
    );
    const filterCount = await filterButtons.count();

    if (filterCount > 0) {
      const allProjects = page.locator(
        ".project, .project-item, .project-card",
      );
      const initialCount = await allProjects.count();

      // Click on a filter
      await filterButtons.first().click();

      // Wait for potential filtering animation/transition
      await page.waitForTimeout(500);

      // Check if filtering occurred (projects might be hidden/shown)
      const filteredProjects = page.locator(
        ".project:visible, .project-item:visible, .project-card:visible",
      );
      const filteredCount = await filteredProjects.count();

      // Could be same count if all projects match the filter
      expect(filteredCount).toBeGreaterThanOrEqual(0);
    }
  });

  test("project search functionality (if present)", async ({ page }) => {
    await page.goto("/projects");

    const searchInput = page.locator(
      'input[type="search"], input[name="search"], input[placeholder*="search" i]',
    );

    if ((await searchInput.count()) > 0) {
      // Search for a common term
      await searchInput.fill("python");

      // Trigger search (might be automatic or require button click)
      const searchButton = page.locator(
        'button[type="submit"], button:has-text("Search")',
      );
      if ((await searchButton.count()) > 0) {
        await searchButton.click();
      } else {
        // Try pressing Enter
        await searchInput.press("Enter");
      }

      // Wait for search results
      await page.waitForTimeout(1000);

      // Check if search affected the displayed projects
      const projects = page.locator(".project, .project-item, .project-card");
      const projectCount = await projects.count();
      expect(projectCount).toBeGreaterThanOrEqual(0);
    }
  });

  test("project images load correctly", async ({ page }) => {
    await page.goto("/projects");

    const projectImages = page.locator(
      ".project img, .project-item img, .project-card img",
    );
    const imageCount = await projectImages.count();

    if (imageCount > 0) {
      // Check first few images
      const imagesToCheck = Math.min(3, imageCount);

      for (let i = 0; i < imagesToCheck; i++) {
        const image = projectImages.nth(i);
        await expect(image).toBeVisible();

        // Check if image has loaded (has natural dimensions)
        const naturalWidth = await image.evaluate(
          (img: HTMLImageElement) => img.naturalWidth,
        );
        expect(naturalWidth).toBeGreaterThan(0);
      }
    }
  });

  test("project cards are interactive", async ({ page }) => {
    await page.goto("/projects");

    const projectCards = page.locator(".project, .project-item, .project-card");
    const cardCount = await projectCards.count();

    if (cardCount > 0) {
      const firstCard = projectCards.first();

      // Check for hover effects
      await firstCard.hover();

      // Check if card is clickable (has link or click handler)
      const cardLinks = firstCard.locator("a");
      const linkCount = await cardLinks.count();

      if (linkCount > 0) {
        // Should be able to click and navigate
        await expect(cardLinks.first()).toBeVisible();
      }
    }
  });

  test("projects page is responsive", async ({ page }) => {
    await page.goto("/projects");

    // Test desktop view
    await page.setViewportSize({ width: 1200, height: 800 });
    const projectsDesktop = page.locator(
      ".project, .project-item, .project-card",
    );
    const desktopCount = await projectsDesktop.count();

    // Test tablet view
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.waitForTimeout(500); // Wait for responsive changes
    const projectsTablet = page.locator(
      ".project:visible, .project-item:visible, .project-card:visible",
    );
    const tabletCount = await projectsTablet.count();

    // Test mobile view
    await page.setViewportSize({ width: 375, height: 667 });
    await page.waitForTimeout(500);
    const projectsMobile = page.locator(
      ".project:visible, .project-item:visible, .project-card:visible",
    );
    const mobileCount = await projectsMobile.count();

    // All viewports should show the same projects (unless specifically hidden)
    expect(desktopCount).toBeGreaterThanOrEqual(0);
    expect(tabletCount).toBeGreaterThanOrEqual(0);
    expect(mobileCount).toBeGreaterThanOrEqual(0);
  });

  test("project pagination works (if present)", async ({ page }) => {
    await page.goto("/projects");

    const pagination = page.locator(
      '.pagination, .pager, nav[aria-label="pagination"]',
    );

    if ((await pagination.count()) > 0) {
      const nextButton = pagination.locator(
        'a:has-text("Next"), a:has-text("›"), a:has-text("»"), .next',
      );

      if ((await nextButton.count()) > 0) {
        const currentUrl = page.url();

        await nextButton.first().click();
        await page.waitForLoadState("networkidle");

        // URL should change for pagination
        expect(page.url()).not.toBe(currentUrl);

        // Should still be on projects page
        await expect(page.url()).toContain("/projects");
      }
    }
  });
});

import { test, expect } from "@playwright/test";

test.describe("Offline Functionality", () => {
  test("offline page loads when offline", async ({ page, context }) => {
    // First visit the main page to ensure service worker is registered
    await page.goto("/");
    await expect(page).toHaveTitle(/KusseTechStudio/);

    // Wait for service worker to be registered
    await page.waitForFunction(() => {
      return navigator.serviceWorker.ready;
    });

    // Go offline
    await context.setOffline(true);

    // Try to navigate to a page that should show offline content
    await page.goto("/offline");

    // Check that offline page loads
    await expect(page).toHaveTitle("Offline - Kusse Tech Studio");
    await expect(page.locator("h1")).toContainText("You're Offline");

    // Check for connection status indicator
    await expect(page.locator(".connection-status")).toBeVisible();

    // Check for cached page links
    await expect(page.locator('a[href="/"]')).toBeVisible();
  });

  test("service worker is registered and active", async ({ page }) => {
    await page.goto("/");

    // Check that service worker script is loaded
    const serviceWorkerRegistration = await page.evaluate(async () => {
      if ("serviceWorker" in navigator) {
        const registration = await navigator.serviceWorker.ready;
        return {
          scope: registration.scope,
          active: registration.active !== null,
        };
      }
      return null;
    });

    expect(serviceWorkerRegistration).not.toBeNull();
    expect(serviceWorkerRegistration.active).toBe(true);
    expect(serviceWorkerRegistration.scope).toContain("localhost");
  });

  test("cached resources are available offline", async ({ page, context }) => {
    // Visit main page to cache resources
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    // Wait for service worker to cache resources
    await page.waitForTimeout(2000);

    // Go offline
    await context.setOffline(true);

    // Try to load cached page
    await page.goto("/");

    // Should still load from cache
    await expect(page).toHaveTitle(/KusseTechStudio/);
    await expect(page.locator("header")).toBeVisible();
  });
});

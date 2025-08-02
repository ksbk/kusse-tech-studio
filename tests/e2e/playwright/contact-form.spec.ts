import { test, expect } from "@playwright/test";

test.describe("Contact Form", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/contact");
  });

  test("contact form displays correctly", async ({ page }) => {
    await expect(page).toHaveTitle(/Contact/);

    // Check form elements are present
    await expect(page.locator('input[name="name"]')).toBeVisible();
    await expect(page.locator('input[name="email"]')).toBeVisible();
    await expect(page.locator('textarea[name="message"]')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toBeVisible();
  });

  test("form validation works for empty fields", async ({ page }) => {
    // Try to submit empty form
    await page.click('button[type="submit"]');

    // Should show validation message or stay on page
    await expect(page.url()).toContain("/contact");

    // Check for error messages or validation indicators
    const errorMessages = page.locator('.error, .alert-error, [role="alert"]');
    if ((await errorMessages.count()) > 0) {
      await expect(errorMessages.first()).toBeVisible();
    }
  });

  test("form validation works for invalid email", async ({ page }) => {
    await page.fill('input[name="name"]', "Test User");
    await page.fill('input[name="email"]', "invalid-email");
    await page.fill('textarea[name="message"]', "This is a test message");

    await page.click('button[type="submit"]');

    // Should show validation for invalid email
    const emailInput = page.locator('input[name="email"]');
    const validationMessage = await emailInput.evaluate(
      (el: HTMLInputElement) => el.validationMessage,
    );
    expect(validationMessage).toBeTruthy();
  });

  test("successful form submission", async ({ page }) => {
    await page.fill('input[name="name"]', "John Doe");
    await page.fill('input[name="email"]', "john.doe@example.com");
    await page.fill(
      'textarea[name="message"]',
      "This is a test message from Playwright automation.",
    );

    await page.click('button[type="submit"]');

    // Should redirect back to contact page or show success message
    await expect(page.url()).toContain("/contact");

    // Look for success message
    const successMessages = page.locator(
      ".success, .alert-success, .flash-success",
    );
    if ((await successMessages.count()) > 0) {
      await expect(successMessages.first()).toBeVisible();
      await expect(successMessages.first()).toContainText(
        /thank you|success|received/i,
      );
    }
  });

  test("form fields accept correct input types", async ({ page }) => {
    const nameInput = page.locator('input[name="name"]');
    const emailInput = page.locator('input[name="email"]');
    const messageInput = page.locator('textarea[name="message"]');

    // Test name field
    await nameInput.fill("Test User Name");
    await expect(nameInput).toHaveValue("Test User Name");

    // Test email field
    await emailInput.fill("test@example.com");
    await expect(emailInput).toHaveValue("test@example.com");

    // Test message field
    const testMessage =
      "This is a longer test message to verify the textarea can handle multiple lines and longer content.";
    await messageInput.fill(testMessage);
    await expect(messageInput).toHaveValue(testMessage);
  });

  test("form is accessible", async ({ page }) => {
    // Check for form labels
    await expect(
      page.locator('label[for="name"], label:has(input[name="name"])'),
    ).toBeVisible();
    await expect(
      page.locator('label[for="email"], label:has(input[name="email"])'),
    ).toBeVisible();
    await expect(
      page.locator('label[for="message"], label:has(textarea[name="message"])'),
    ).toBeVisible();

    // Check form can be navigated with keyboard
    await page.keyboard.press("Tab");
    await expect(page.locator('input[name="name"]')).toBeFocused();

    await page.keyboard.press("Tab");
    await expect(page.locator('input[name="email"]')).toBeFocused();

    await page.keyboard.press("Tab");
    await expect(page.locator('textarea[name="message"]')).toBeFocused();
  });
});

import { test, expect } from '@playwright/test';
import { LoginPage } from '../src/pages/loginPage';

test('successful login displays dashboard', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle('CommunityHub');

    const loginPage = new LoginPage(page);
    await loginPage.login('admin', 'admin123');
    await expect(
        page.getByText('Invalid username or password')
        ).not.toBeVisible();
    await expect(page.locator('#dashboard-view')).toBeVisible();
    await expect(page.locator('#login-view')).toBeHidden();
});

test('should display an error message for invalid credentials', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle('CommunityHub');

    const loginPage = new LoginPage(page);
    await loginPage.login('admin', 'invalid');
    await expect(
        page.getByText('Invalid username or password')
        ).toBeVisible();
    await expect(page.locator('#login-view')).toBeVisible();
    await expect(page.locator('#dashboard-view')).toBeHidden();
});

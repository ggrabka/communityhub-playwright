import { test, expect } from '@playwright/test';
import { LoginPage } from '../src/pages/loginPage';
import { DashboardPage } from '../src/pages/dashboardPage';

test('successful logout displays login view', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle('CommunityHub');

    const loginPage = new LoginPage(page);
    const dashboardPage = new DashboardPage(page);
    await loginPage.login('admin', 'admin123');

    await expect(page.locator('#dashboard-view')).toBeVisible();
    await expect(page.locator('#login-view')).toBeHidden();

    await dashboardPage.logout();
    await expect(page.locator('#login-view')).toBeVisible();
    await expect(page.locator('#dashboard-view')).toBeHidden();
});
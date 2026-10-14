import { Locator, Page } from '@playwright/test';

export class DashboardPage {
    private readonly logoutButton: Locator;

    constructor(private page: Page) {
        this.logoutButton = this.page.getByRole('button', {name: 'Logout'   });
    }

    async logout() {
        await this.logoutButton.click();
    }
}
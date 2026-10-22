import { Locator, Page } from '@playwright/test';

export class DashboardPage {
    private readonly logoutButton: Locator;
    private readonly hamburgerButton: Locator;
    private readonly tasksButton: Locator;

    constructor(private page: Page) {
        this.logoutButton = this.page.getByRole('button', {name: 'Logout'   });
        this.hamburgerButton = this.page.getByRole('button', {name: /Menu/   });
        this.tasksButton = this.page.getByRole('button', {name: 'Tasks', exact: true});
    }

    async logout() {
        await this.logoutButton.click();
    }

    async navigateToTasks(): Promise<void> {
        await this.hamburgerButton.click();
        await this.tasksButton.click();
    }
}
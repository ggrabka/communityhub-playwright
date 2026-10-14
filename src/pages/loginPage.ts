import { Locator, Page} from '@playwright/test';

export class LoginPage {
    private readonly usernameInput: Locator;
    private readonly passwordInput: Locator;
    private readonly loginButton: Locator;
    private readonly loginView: Locator;

    constructor(private page: Page) {
        this.usernameInput = this.page.getByLabel('username');
        this.passwordInput = this.page.getByLabel('password');
        this.loginButton = this.page.getByRole('button', { name: 'Login' });
        this.loginView = this.page.locator('#login-view');
    }
    
    async login(username: string, password: string) {
        await this.usernameInput.fill(username);
        await this.passwordInput.fill(password);
        await this.loginButton.click();
    }
}
import {expect,Locator, Page} from '@playwright/test';

export default class LoginPage{

    readonly page;
    readonly usernameInput:Locator;
    readonly passwordInput:Locator;
    readonly loginButton:Locator;   
    readonly errorMessage:Locator;

    constructor (page: Page){
        this.page=page;
        this.usernameInput=page.getByRole('textbox', { name: 'Username' });
        this.passwordInput=page.getByRole('textbox', { name: 'Password' });
        this.loginButton=page.getByRole('button', { name: 'Login'});
        this.errorMessage=page.getByText('Epic sadface: Username and password do not match any user in this service');
    }

    async login(username:string,password:string){
        await this.usernameInput.fill(username);
        await this.passwordInput.fill(password);
        await this.loginButton.click();
    }

    async verifyErrorMessage(){
        await expect(this.errorMessage).toBeVisible();
    }

    async verifySuccessfulLogin(){
        await expect(this.page).toHaveURL('https://www.saucedemo.com/inventory.html');
    }

}


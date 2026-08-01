import { expect, Locator, Page } from '@playwright/test';

export default class CheckoutPage {
    readonly page: Page;
    readonly checkoutButton: Locator;
    readonly firstNameInput: Locator;
    readonly lastNameInput: Locator;
    readonly postalCodeInput: Locator;
    readonly continueButton: Locator;
    readonly productTitle: Locator;
    readonly productPrice: Locator;
    readonly totalPrice: Locator;
    readonly finishOrderButton: Locator;

    constructor(page: Page) {
        this.page = page;
        this.checkoutButton = page.getByRole('button', { name: 'checkout' });
        this.firstNameInput = page.locator('[data-test="firstName"]');
        this.lastNameInput = page.locator('[data-test="lastName"]');
        this.postalCodeInput = page.locator('[data-test="postalCode"]');
        this.continueButton = page.getByRole('button', { name: 'Continue' });
        this.productTitle = page.locator('.inventory_item_name');
        this.productPrice = page.locator('.inventory_item_price');
        this.totalPrice = page.locator('.summary_total_label');
        this.finishOrderButton = page.getByRole('button', { name: 'Finish' });
    }

    async clickOnCheckoutBtn() {
        await this.checkoutButton.click();
    }

    async enterCustomerInfo(firstName: string, lastName: string, postalCode: string) {
        await this.firstNameInput.fill(firstName);
        await this.lastNameInput.fill(lastName);
        await this.postalCodeInput.fill(postalCode);
    }

    async clickContinue() {
        await this.continueButton.click();
    }

    async verifyCheckoutStepOnePage() {
        await expect(this.page).toHaveURL(/checkout-step-one\.html/);
        
    }

    async verifyCheckoutStepTwoPage() {
        await expect(this.page).toHaveURL(/checkout-step-two\.html/);
    }

    async verifyProductDetails(productName: string, productPrice: string,totalPrice: string) {
        await expect(this.productTitle).toHaveText(productName);
        await expect(this.productPrice).toHaveText(productPrice);
        await expect(this.totalPrice).toContainText(totalPrice);
    }
    async clickFinishOrder() {
        await this.finishOrderButton.click();
    }

    async verifyOrderConfirmationPage() {
        await expect(this.page).toHaveURL(/checkout-complete\.html/);
        await expect(this.page.locator('.complete-header')).toHaveText('Thank you for your order!');
    }
}

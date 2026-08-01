import { expect, test } from '@playwright/test';
import LoginPage from '../pages/login.page';
import ProductsPage from '../pages/products.page';
import CheckoutPage from '../pages/checkout.page';

test('Checkout flow with valid user', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const productsPage = new ProductsPage(page);
    const checkoutPage = new CheckoutPage(page);

    await page.goto(process.env.APP_URL!);
    await loginPage.login(process.env.TEST_USER_NAME!, process.env.TEST_PASSWORD!);
    await loginPage.verifySuccessfulLogin();
    await productsPage.verifyProductPage();
    await productsPage.addProductToCart();
    await productsPage.verifyProductAddedToCart();
    await productsPage.clickCartIcon();
    await checkoutPage.clickOnCheckoutBtn();
    await checkoutPage.verifyCheckoutStepOnePage();
    await checkoutPage.enterCustomerInfo('John', 'Doe', '12345');
    await checkoutPage.clickContinue();
    await expect(page).toHaveURL(/checkout-step-two\.html/);
    await checkoutPage.verifyCheckoutStepTwoPage();
    await checkoutPage.verifyProductDetails('Sauce Labs Backpack', '$29.99', 'Total: $32.39');
    await checkoutPage.clickFinishOrder();
    await checkoutPage.verifyOrderConfirmationPage();   
});

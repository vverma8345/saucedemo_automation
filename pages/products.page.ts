import{expect,Locator, Page} from '@playwright/test';

export default class ProductsPage{

    readonly page;
    readonly productTitle:Locator;
    readonly addToCartButton:Locator;
    readonly cartIcon:Locator;

    constructor (page: Page){
        this.page=page;
        this.productTitle=page.locator("//a[@id='item_4_title_link']/div");
        this.addToCartButton=page.locator("//button[@id='add-to-cart-sauce-labs-backpack']");
        this.cartIcon=page.locator("//a[@class='shopping_cart_link']/span");}

    async verifyProductPage(){
        await expect(this.productTitle).toBeVisible();
    }

    async addProductToCart(){
        await this.addToCartButton.click();
    }

    async verifyProductAddedToCart(){
        await expect(this.cartIcon).toHaveText('1');
    }

    async clickCartIcon(){
        await this.cartIcon.click();
    }

    async verifyCartPage(){
        await expect(this.page).toHaveURL('https://www.saucedemo.com/cart.html');
    }

    

}   
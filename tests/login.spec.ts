import {test,expect} from '@playwright/test'
import LoginPage from '../pages/login.page'

test('Login with invalid credentials',async({page})=>{
    
    const loginPage=new LoginPage(page);
    await page.goto(process.env.APP_URL!);
    await loginPage.login('invalid_user','invalid_password');
    await loginPage.verifyErrorMessage();

})

test('Login with valid credentials',async({page})=>{
    
    const loginPage=new LoginPage(page);
    await page.goto(process.env.APP_URL!);
    await loginPage.login(process.env.TEST_USER_NAME!,process.env.TEST_PASSWORD!);
    await loginPage.verifySuccessfulLogin();

})
    
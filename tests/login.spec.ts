import {test,expect} from '@playwright/test'
import LoginPage from '../pages/login.page'
import { log } from 'console';

test('Login with invalid credentials',async({page})=>{
    
    const loginPage=new LoginPage(page);
    await page.goto(process.env.APP_URL!);
    log('info', 'Navigating to the application URL');
    await loginPage.login('invalid_user','invalid_password');
    log('info', 'Attempting login with invalid credentials');
    await loginPage.verifyErrorMessage();
    log('info', 'Invalid login attempt completed');


})

test('Login with valid credentials',async({page})=>{
    
    const loginPage=new LoginPage(page);
    await page.goto(process.env.APP_URL!);
    log('info', 'Navigating to the application URL');
    await loginPage.login(process.env.TEST_USER_NAME!,process.env.TEST_PASSWORD!);
    log('info', 'Attempting login with valid credentials');
    await loginPage.verifySuccessfulLogin();
    log('info', 'Valid login attempt completed');

})
    
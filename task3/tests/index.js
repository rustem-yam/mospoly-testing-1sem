const { describe, it, beforeEach, afterEach } = require("mocha");
const { Builder, Browser } = require("selenium-webdriver");
const MarketPage = require("../pages/YandexMarket.js");
const fs = require("fs");
const assert = require("assert");
const { allure } = require("allure-mocha/dist/MochaAllureReporter");

describe("Markets Test Suite", function () {
    let driver;
    let marketPage;
    this.timeout(90000);
    beforeEach(async function () {
        driver = await new Builder().forBrowser(Browser.CHROME).build();
        marketPage = new MarketPage(driver);
        await marketPage.open();
    });

    afterEach(async function () {
        if (this.currentTest.state === "failed") {
            const testCaseName = "get_samsung_gaming_phones";

            const screenshotPath = await marketPage.takeScreenshot(
                driver,
                testCaseName + ".png"
            );

            console.error(
                `Тест упал по причине ошибки: ${this.currentTest.err.message}. Скриншот сохранен в файл: ${screenshotFilename}`
            );

            allure.attachment(
                testCaseName,
                fs.readFileSync(screenshotPath),
                "image/png"
            );
        }
        await driver.quit();
    });

    it("get_samsung_gaming_phones", async function () {
        allure.epic("ЯндексМаркет");
        allure.feature("Игровые телефоны");
        allure.story("Фильтрация по производителю Samsung");

        await allure.step("navigate to gaming phones", async () => {
            await marketPage.navigateToGamingPhones();
            await driver.sleep(3000);

            await allure.step("get first five products", async () => {
                const firstFiveProducts =
                    await marketPage.getFirstFiveProducts();
                console.log("Первые пять товаров:");
                console.log(firstFiveProducts);
                allure.attachment(
                    "First Five Products",
                    JSON.stringify(firstFiveProducts, null, 2),
                    "application/json"
                );
            });
        });

        await allure.step("set samsung manufacturer", async () => {
            await marketPage.setSamsungManufacturer();
            await driver.sleep(3000);
            await allure.step("get first five products", async () => {
                console.log("Первые пять товаров Samsung:");
                const firstFiveFilteredProducts =
                    await marketPage.getFirstFiveProducts();
                console.log(firstFiveFilteredProducts);
                allure.attachment(
                    "First Five Samsung Products",
                    JSON.stringify(firstFiveFilteredProducts, null, 2),
                    "application/json"
                );
                assert.equal(
                    marketPage.isSamsungProducts(firstFiveFilteredProducts),
                    true,
                    "Товары должны быть компании самсунг"
                );
            });
        });
    });
});

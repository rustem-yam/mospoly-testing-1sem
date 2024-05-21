const assert = require("assert");
const { Builder, Browser, By } = require("selenium-webdriver");

const driver = new Builder().forBrowser("chrome").build();

let total = 5;
let remaining = 5;

lambdaTest();

async function lambdaTest() {
  try {
    await driver.get("https://lambdatest.github.io/sample-todo-app/");
    await driver.manage().window().maximize();
    await driver.sleep(1000);

    const headingElem = await driver.findElement(By.css("h2"));
    const expectedHeading = "LambdaTest Sample App";
    const heading = await headingElem.getText();
    assert.equal(heading, expectedHeading);

    for (let i = 1; i <= total; i++) {
      let remainingElem = await driver.findElement(
        By.xpath("//span[@class='ng-binding']")
      );
      let text = await remainingElem.getText();
      let expectedText = `${remaining} of ${total} remaining`;
      assert.equal(text, expectedText);

      let item = await driver.findElement(
        By.xpath(`//input[@name='li${i}']/following-sibling::span`)
      );
      let itemClass = await item.getAttribute("class");
      assert.equal(itemClass, "done-false");

      await driver.findElement(By.name("li" + i)).click();
      remaining--;
      await driver.sleep(1000);

      itemClass = await item.getAttribute("class");
      assert.equal(itemClass, "done-true");
    }

    await driver.findElement(By.id("sampletodotext")).sendKeys("New Item");
    await driver.sleep(1000);

    await driver.findElement(By.id("addbutton")).click();
    remaining++;
    total++;

    let item = await driver.findElement(
      By.xpath("//input[@name='li6']/following-sibling::span")
    );
    let itemText = await item.getText();
    let itemClass = await item.getAttribute("class");
    assert.equal(itemText, "New Item");
    assert.equal(itemClass, "done-false");

    let remainingElem = await driver.findElement(
      By.xpath("//span[@class='ng-binding']")
    );
    let text = await remainingElem.getText();
    let expectedText = `${remaining} of ${total} remaining`;
    assert.equal(text, expectedText);
    await driver.sleep(1000);

    await driver.findElement(By.name("li6")).click();
    remaining--;

    itemClass = await item.getAttribute("class");
    assert.equal(itemClass, "done-true");

    remainingElem = await driver.findElement(
      By.xpath("//span[@class='ng-binding']")
    );
    text = await remainingElem.getText();
    expectedText = `${remaining} of ${total} remaining`;
    assert.equal(text, expectedText);
    await driver.sleep(1000);
  } catch (err) {
    driver.takeScreenshot().then((image) => {
      require("fs").writeFileSync("screenshot_error.png", image, "base64");
    });
    console.error("Тест упал по причине ошибки: %s", err);
  } finally {
    await driver.quit();
  }
}

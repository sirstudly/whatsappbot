const {Builder, By, Key, until} = require('selenium-webdriver');
const chrome = require("selenium-webdriver/chrome");
const DEFAULT_WAIT_MS = 30000;

class WhatsappHandler {

    async initialize() {
        // Initialize ChromeDriver
        const chromeOptions = new chrome.Options();
        for (const opt of process.env.CHROME_OPTIONS.split(' ')) {
            chromeOptions.addArguments(opt);
        }
        this.driver = await new Builder().forBrowser('chrome').setChromeOptions(chromeOptions).build();

        if(process.env.NGROK_URL) {
            this.ngrokEndpoint = await this._getNgrokEndpoint();
        }

        await this.driver.get('https://web.whatsapp.com');
        this.consoleInfo("Please login to Whatsapp now.");

        return this;
    }

    async _getNgrokEndpoint() {
        await this.driver.get(process.env.NGROK_URL + "/status");
        const ngrok_url = await this.driver.wait(until.elementLocated(By.xpath(
            "//h4[text()='command_line']/../div/table/tbody/tr[th[text()='URL']]/td")), DEFAULT_WAIT_MS).getText();
        this.consoleInfo("ngrok URL: " + ngrok_url);
        return ngrok_url;
    }

    async postMessageToGroup(recipient, message) {
        await this.driver.findElement(By.xpath(`//span[@title='${recipient}']`)).click();
        await this.driver.findElement(By.xpath("//div[text()='Type a message']/../div[@contenteditable='true']"))
            .sendKeys(message);
        await this.driver.findElement(By.xpath("//span[@data-icon='send']")).click();
    }

    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    consoleInfo(message) {
        console.info(new Date().toLocaleString() + " " + message);
    }

    consoleError(message) {
        console.error(new Date().toLocaleString() + " " + message);
    }
}

module.exports = new WhatsappHandler();
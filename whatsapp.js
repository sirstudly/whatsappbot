const {Builder, By, Key, until} = require('selenium-webdriver');
const chrome = require("selenium-webdriver/chrome");
const DEFAULT_WAIT_MS = 30000;
const CELINE_TOP_FAN = [
    "Every night in my dreams...",
    "I see you, I feel you...",
    "That is how I know you go on...",
    "Far across the distance...",
    "And spaces between us...",
    "You have come to show you go on...",
    "Near, far, wherever you are...",
    "I believe that the heart does go on...",
    "Once more you open the door...",
    "And you're here in my heart...",
    "And my heart will go on and on...",
    "Love can touch us one time...",
    "And last for a lifetime...",
    "And never let go 'til we're gone...",
    "Love was when I loved you...",
    "One true time I'd hold to...",
    "In my life we'll always go on...",
    "Near, far, wherever you are...",
    "I believe that the heart does go on...",
    "Once more you open the door",
    "And you're here in my heart...",
    "And my heart will go on and on...",
    "You're here, there's nothing I fear...",
    "And I know that my heart will go on...",
    "We'll stay forever this way...",
    "You are safe in my heart and...",
    "My heart will go on and on..."
];

class WhatsappHandler {

    CELINE_TOP_FAN_IDX = 0;

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

        if(process.env.START_INDEX) {
            this.CELINE_TOP_FAN_IDX = process.env.START_INDEX;
        }

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
        // for fun, let's replace "Knock Knock" with a lyric from one of Celine's top hits!
        if (message === "Knock Knock") {
            message = CELINE_TOP_FAN[this.CELINE_TOP_FAN_IDX];
            this.CELINE_TOP_FAN_IDX = (this.CELINE_TOP_FAN_IDX + 1) % CELINE_TOP_FAN.length;
        }
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
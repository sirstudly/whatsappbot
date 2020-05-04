const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const whatsappHandler = require("./whatsapp");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json());

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server available on port ${port}`);
});

app.post("/post-message", async(req, res) => {
    try {
        console.log("Responding to post-message: " + JSON.stringify(req.body));
        await whatsappHandler.postMessageToGroup(process.env.WHATSAPP_RECIPIENT_NAME, req.body.message);
        return res.status(200).send('{ "success": true }');
    } catch (ex) {
        console.error(ex);
        return res.status(400).send(`{ "success": false, "error": ${JSON.stringify(ex)} }`);
    }
});

(async function init() {
    await whatsappHandler.initialize()
        .catch(ex => console.error("Error on initialise: " + ex));
})();

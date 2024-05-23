import express from "express";
import { nanoid } from "nanoid"
import fs from "node:fs"
const app = express();

app.use(express.json());

app.post("/url-shortner", (req, res) => {
    console.log(nanoid(8));
    const shorturl = nanoid(8);

    const urlfileData = fs.readFileSync("urlmap.json", { encoding: "utf-8" });
    const urlfileJson = JSON.parse(urlfileData);
    urlfileJson[shorturl] = req.body.url;
    fs.writeFileSync("urlmap.json", JSON.stringify(urlfileJson));

    res.json({
        success: true,
        message: `http://localhost:9000/${shorturl}`,
    })
})
app.get("/:shortUrl", (res, req) => {
    const filedata = fs.readFileSync("urlmap.json", { encoding: "utf-8" })
    const filedataJson = JSON.parse(filedata);
    const shortUrl = req.params.shortUrl;
    const longurl = filedataJson[longurl];
    res.redirect(longurl);
})

app.listen(9000, () => console.log("Server is up and runnning on port 9000"));
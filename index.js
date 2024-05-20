import express from "express";
import {nanoid} from "nanoid";
import fs from "node:fs";
// import cors from "cors";

import path from "node:path";
import { fileURLToPath } from "node:url";

const app = express();
const PORT = 4000;

// app.use(cors({
//     origin: "http://127.0.0.1:5500"
// }));

app.use(express.json());

const isValidUrl = (url) =>{
    try {
        new URL (url)
        return true;
    } catch(err) {
        return false;
    }
}

/******* */
const __filename = fileURLToPath(import.meta.url);   
const __dirname = path.dirname(__filename);         //currrent folder

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html");
})
/********* */

// const input = document.getElementById

app.post ("/url-shortner", (req, res) => {
    console.log(req.body);
    if(!isValidUrl(req.body.url)) {
        return res.status(400).json({
            status: false,
            message: "Not a Valid URL"
        })
    }
    console.log("second  ============",req.body);

    const shortUrl = nanoid(10);

    const urlMap = {
        [shortUrl] : req.body.url,
    }

    /**
   * 1. Read data from exisitng file
   * 2. Parse it in the form of JSON
   * 3. Add the data to the JSON
   * 4. Write the new data set to the JSON file
   */

    const readJsonFile = fs.readFileSync("urlmap.json", {encoding : "utf-8"});
    const parseReadData = JSON.parse(readJsonFile);
    parseReadData[shortUrl] = req.body.url;
    fs.writeFileSync("urlmap.json", JSON.stringify(parseReadData)); 
    res.json({
        success: true,
        message: `http://localhost:4000/${shortUrl}`
    })
})


app.get("/:shortUrl", (req, res) => {

    const readFileData = fs.readFileSync("urlmap.json", {encoding:"utf-8"});
    const parseFileData = JSON.parse(readFileData);
    const shortUrl = req.params.shortUrl;
    const longUrl = parseFileData[shortUrl];
    if (!longUrl) {
        return res
          .status(404)
          .json({ success: false, message: "Short URL not found" });
      }
      res.redirect(longUrl);
})


app.listen(PORT, (req, res) => {
    console.log(`server is up and running on port ${PORT}`);
})
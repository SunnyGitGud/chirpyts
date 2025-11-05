import express from "express";
import { MiddlewareLogResponses, MiddlewareMetricsIns } from "./middleware.js";
import { config } from "./config.js";
import path from "path";
import fs from "fs";
import { badRequest400, MiddlewareErrHandle } from "./error.js";
const app = express();
const PORT = 8080;
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
app.use(MiddlewareLogResponses);
app.use(express.json());
app.use("/app", MiddlewareMetricsIns, express.static("./src/app/"));
app.get("/api/healthz", MiddlewareMetricsIns, async (req, res, next) => {
    try {
        await handlerReadiness(req, res);
    }
    catch (err) {
        next(err);
    }
});
app.post("/admin/reset", handerMetricReset);
app.post("/api/validate_chirp", async (req, res, next) => {
    try {
        await handlerchirp(req, res);
    }
    catch (err) {
        next(err);
    }
});
app.use(MiddlewareErrHandle);
app.get("/admin/metrics", (_req, res) => {
    const filePath = path.join(process.cwd(), "src/app/visited.html");
    fs.readFile(filePath, "utf8", (err, data) => {
        if (err) {
            res.status(500).send("error loading HTML");
            return;
        }
        const html = data.replace("NUM", config.fileServerHits.toString());
        res.set("Content-Type", "text/html; charset=utf-8");
        res.send(html);
    });
});
async function handlerReadiness(_req, res) {
    res.set("Content-Type", "text/plain");
    res.send("OK");
}
async function handerMetricReset(_req, res) {
    config.fileServerHits = 0;
    res.status(200).send("OK");
}
async function handlerchirp(req, res) {
    const parsedBody = req.body;
    if (typeof parsedBody.body !== "string") {
        throw new badRequest400("Chirp is required");
    }
    if (parsedBody.body.length > 140) {
        throw new badRequest400("Chirp is too long. Max length is 140");
    }
    const profaneWords = ["kerfuffle", "sharbert", "fornax"];
    const words = parsedBody.body.split(" ");
    for (let i = 0; i < words.length; i++) {
        const w = words[i];
        for (const bad of profaneWords) {
            if (w.toLowerCase() === bad.toLowerCase()) {
                words[i] = "****";
                break;
            }
        }
    }
    const cleanedBody = words.join(" ");
    res.status(200).json({ cleanedBody: cleanedBody });
}

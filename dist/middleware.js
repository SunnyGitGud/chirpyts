import { config } from "./config.js";
export function MiddlewareLogResponses(req, res, next) {
    res.on("finish", () => {
        if (res.statusCode < 200 || res.statusCode >= 300) {
            console.log(`[NON-OK] ${req.method} ${req.url} - Status: ${res.statusCode}`);
        }
    });
    next();
}
export function MiddlewareMetricsIns(_req, _res, next) {
    config.api.fileServerHits++;
    next();
}

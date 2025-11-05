import { NextFunction } from "express";
import { Request, Response } from "express"
import { config } from "./config"


export function MiddlewareLogResponses(req: Request, res: Response, next: NextFunction): void {
  res.on("finish", () => {
    if (res.statusCode < 200 || res.statusCode >= 300) {
      console.log(`[NON-OK] ${req.method} ${req.url} - Status: ${res.statusCode}`)
    }
  })
  next()
}

export function MiddlewareMetricsIns(_req: Request, _res: Response, next: NextFunction) {
  config.api.fileServerHits++
  next()
}


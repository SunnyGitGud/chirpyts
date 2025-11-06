import path from "path";
import fs from "fs";
import { Request, Response } from "express";
import { config } from "../config.js";

export function metricsHandler(_req: Request, res: Response) {
  const filePath = path.join(process.cwd(), "src/app/visited.html");

  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) {
      res.status(500).send("Error loading HTML");
      return;
    }

    const html = data.replace("NUM", config.api.fileServerHits.toString());
    res.set("Content-Type", "text/html; charset=utf-8");
    res.send(html);
  });
}


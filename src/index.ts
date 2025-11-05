import express from "express"
import postgres from "postgres";
import { migrate } from "drizzle-orm/postgres-js/migrator"
import { drizzle } from "drizzle-orm/postgres-js";
import { Request, Response } from "express"
import { MiddlewareLogResponses, MiddlewareMetricsIns } from "./middleware.js";
import { config } from "./config.js";
import path from "path"
import fs from "fs"
import { badRequest400, MiddlewareErrHandle } from "./error.js";
import { createUser } from "./db/queries/users.js";

const migrationClient = postgres(config.db.url, { max: 1 })
await migrate(drizzle(migrationClient), config.db.migrationConfig)

const app = express();

app.listen(config.api.port, () => {
  console.log(`Server is running at http://localhost:${config.api.port}`)
})

app.use(MiddlewareLogResponses)
app.use(express.json())
app.use("/app", MiddlewareMetricsIns, express.static("./src/app/"));
app.get("/api/healthz", MiddlewareMetricsIns, async (req, res, next) => {
  try {
    await handlerReadiness(req, res);
  } catch (err) {
    next(err)
  }
});
app.post("/admin/reset", handerMetricReset);
app.post("/api/validate_chirp", async (req, res, next) => {
  try {
    await handlerchirp(req, res);
  } catch (err) {
    next(err)
  }
})

app.post("/api/users")

app.get("/admin/metrics", (_req, res) => {
  const filePath = path.join(process.cwd(), "src/app/visited.html")
  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) {
      res.status(500).send("error loading HTML")
      return;
    }
    const html = data.replace("NUM", config.api.fileServerHits.toString());
    res.set("Content-Type", "text/html; charset=utf-8");
    res.send(html);
  })
});

app.use(MiddlewareErrHandle)


async function handlerReadiness(_req: Request, res: Response): Promise<void> {
  res.set("Content-Type", "text/plain")
  res.send("OK")
}


async function handerMetricReset(_req: Request, res: Response): Promise<void> {
  config.api.fileServerHits = 0
  res.status(200).send("OK")
}

async function handlerchirp(req: Request, res: Response): Promise<void> {
  const parsedBody = req.body
  if (typeof parsedBody.body !== "string") {
    throw new badRequest400("Chirp is required")
  }

  if (parsedBody.body.length > 140) {
    throw new badRequest400("Chirp is too long. Max length is 140")
  }
  const profaneWords = ["kerfuffle", "sharbert", "fornax"];
  const words = parsedBody.body.split(" ")

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
  res.status(200).json({ cleanedBody: cleanedBody })
}

async function handlerUsersCreate(req: Request, res: Response): Promise<void> {
  type parameters = {
    email: string;
  }
  const params: parameters = req.body

  if (!params.email) {
    throw new badRequest400("Missing required fields")
  }
  const user = await createUser({ email: params.email })
  if (!user) {
    throw new Error("Could not create user")
  }

}

import express from "express"
import postgres from "postgres";
import { migrate } from "drizzle-orm/postgres-js/migrator"
import { drizzle } from "drizzle-orm/postgres-js";
import { MiddlewareLogResponses, MiddlewareMetricsIns } from "./middleware.js";
import { config } from "./config.js";

import { MiddlewareErrHandle } from "./error.js";


import { handerMetricReset } from "./api/reset.js";
import { handlerReadiness } from "./api/readiness.js";
import { metricsHandler } from "./api/metrics.js";
import { handlerUpdateUser, handlerUsersCreate } from "./api/userCreate.js"
import { handlerchirp, handlerChirpsRetrieve, handlerGetChirpByID } from "./api/Chirp.js";
import { handlerLogin, handleRefresh, handleRevoke } from "./api/login.js";

const migrationClient = postgres(config.db.url, { max: 1 })
await migrate(drizzle(migrationClient), config.db.migrationConfig)

const app = express();

app.listen(config.api.port, () => {
  console.log(`Server is running at http://localhost:${config.api.port}`)
})

app.use(MiddlewareLogResponses)
app.use(express.json())
app.use("/app", MiddlewareMetricsIns, express.static("./src/app/"));
app.get("/api/healthz", MiddlewareMetricsIns, (req, res, next) => {
  Promise.resolve(handlerReadiness(req, res)).catch(next)
});

app.post("/admin/reset", (req, res, next) => {
  Promise.resolve(handerMetricReset(req, res)).catch(next);
});

app.post("/api/users", (req, res, next) => {
  Promise.resolve(handlerUsersCreate(req, res)).catch(next);
})

app.post("/api/login", (req, res, next) => {
  Promise.resolve(handlerLogin(req, res)).catch(next);
})

app.post("/api/chirps", (req, res, next) => {
  Promise.resolve(handlerchirp(req, res)).catch(next);
})

app.get("/api/chirps", (req, res, next) => {
  Promise.resolve(handlerChirpsRetrieve(req, res)).catch(next);
})


app.put("/api/users", (req, res, next) => {
  Promise.resolve(handlerUpdateUser(req, res)).catch(next)
})

app.get("/api/chirps/:chirpID", (req, res, next) => {
  Promise.resolve(handlerGetChirpByID(req, res)).catch(next);
})
app.post("/api/refresh", (req, res, next) => {
  Promise.resolve(handleRefresh(req, res)).catch(next);
});
app.post("/api/revoke", (req, res, next) => {
  Promise.resolve(handleRevoke(req, res)).catch(next);
});

app.get("/admin/metrics", metricsHandler)
app.use(MiddlewareErrHandle)



import { config } from "./config.js";
import { reset } from "./db/queries/users";
import { forbidden403 } from "./error";
export async function handerMetricReset(_req, res) {
    if (config.api.platform !== "dev") {
        console.log(config.api.platform);
        throw new forbidden403("Reset is only allowed in dev environment.");
    }
    config.api.fileServerHits = 0;
    await reset();
    res.write("Hits reset to 0");
    res.end();
}

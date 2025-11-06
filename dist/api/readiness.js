export async function handlerReadiness(_req, res) {
    res.set("Content-Type", "text/plain");
    res.send("OK");
}

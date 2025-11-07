import { upgradeUserbyID } from "../db/queries/users.js";
export async function upgradeUser(req, res) {
    const param = req.body;
    if (param.event !== "user.upgraded") {
        res.status(204).send();
        return;
    }
    await upgradeUserbyID(param.data.userId);
    res.status(204).send();
}

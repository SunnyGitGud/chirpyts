import { Request, Response } from "express"

export async function handlerReadiness(_req: Request, res: Response): Promise<void> {
  res.set("Content-Type", "text/plain")
  res.send("OK")
}


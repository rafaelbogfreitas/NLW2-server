import { Response, Request } from "express";
import db from "../database/connection";
export default class ConnectionsControllers {
  async create(req: Request, res: Response) {
    const { user_id } = req.body;

    await db('connections').insert({
      user_id,
    });

    return res.status(201).send();

  }

  async index(req: Request, res: Response) {
    const [{total}] = await db("connections").count("* as total");

    return res.status(200).json({
      total
    })
  }
}
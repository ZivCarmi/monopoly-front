import { Request, Response } from "express";
import { rooms } from "./gameController";

export const getRoomData = (req: Request<{ id: string }>, res: Response) => {
  const { id } = req.params;

  if (!rooms[id]) {
    return res.status(200).json({ room: null });
  }

  return res.status(200).json({ room: rooms[id] });
};

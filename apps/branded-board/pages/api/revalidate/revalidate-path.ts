/* eslint-disable import/no-anonymous-default-export */
import { NextApiRequest, NextApiResponse } from "next";

// import { cookies } from "next/header";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (!req.body.path) {
    return res
      .status(400)
      .json({ message: "Path query parameter is required" });
  }

  await res.revalidate(req.body.path);
  return res.json({ revalidated: true });
};

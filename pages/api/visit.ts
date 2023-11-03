import { FilteredSkillType } from "@/types/TripodType";
import { readFileSync, writeFileSync } from "fs";
import type { NextApiRequest, NextApiResponse } from "next";
import path from "path";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<{ visitCount: number } | string>
) {
  if (req.method === "GET") {
    // try {
    //   res.status(200).json({ visitCount });
    // } catch (error) {
    //   console.log(error);
    //   res.status(500).send(``);
    // }
  } else if (req.method === "POST") {
    try {
      const dataDirectory = path.join(process.cwd(), "data");
      const visitDate = new Date();
      const tripodStr: string = readFileSync(
        dataDirectory + `/${visitDate}.txt`
      ).toString();
    } catch (error) {}
  }
  res.send("3");
}

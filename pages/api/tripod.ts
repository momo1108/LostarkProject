import { FilteredSkillType } from "@/types/TripodType";
import { readFileSync } from "fs";
import type { NextApiRequest, NextApiResponse } from "next";
import path from "path";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<{ tripod: FilteredSkillType[] } | string>
) {
  try {
    const dataDirectory = path.join(process.cwd(), "data");
    const tripodStr: string = await readFileSync(
      dataDirectory + `/class_${req.query.class}.json`
    ).toString();
    const tripod: FilteredSkillType[] = JSON.parse(tripodStr);
    res.status(200).json({ tripod });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .send(`${req.query.class} 클래스의 트라이포드를 찾지 못했습니다.`);
  }
}

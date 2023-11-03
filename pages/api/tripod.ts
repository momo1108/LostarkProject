import { FilteredSkillType } from "@/types/TripodType";
import { readFileSync, writeFileSync } from "fs";
import type { NextApiRequest, NextApiResponse } from "next";
import path from "path";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<{ tripod: FilteredSkillType[] } | string>
) {
  console.log(req);
  if (req.method === "GET") {
    try {
      const dataDirectory = path.join(process.cwd(), "data");
      const tripodStr: string = readFileSync(
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
  } else if (req.method === "POST") {
    try {
      const dataDirectory = path.join(process.cwd(), "data");
      const data = req.body.data;
      // console.log("########req.body#########");
      // console.log(req.body);
      writeFileSync(
        dataDirectory + `/class_${data[0]}.json`,
        JSON.stringify(data[1])
      );
      res.status(200).send(req.body);
    } catch (error) {
      console.log(error);
      res.status(500).send("데이터 업데이트에 실패했습니다.");
    }
  }
}

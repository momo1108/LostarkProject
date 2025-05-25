// pages/api/proxy.ts
import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";

// 모바일 기기로 인식하는 경우 요청이 모바일 서비스 페이지로 리다이렉트 되므로, User-Agent를 PC로 설정합니다.
const USER_AGENT_DESKTOP =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) " +
  "AppleWebKit/537.36 (KHTML, like Gecko) " +
  "Chrome/123.0.0.0 Safari/537.36";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { name } = req.query;
  if (typeof name !== "string") {
    return res.status(400).json({ error: "Invalid character name" });
  }

  try {
    const result = await axios.get(
      `https://lostark.game.onstove.com/Profile/Character/${name}`,
      {
        headers: {
          "User-Agent": USER_AGENT_DESKTOP,
        },
      }
    );
    res.status(200).send(result.data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch character data" });
  }
}

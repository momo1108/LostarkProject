import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<{ visitCount: number } | string>
) {
  const prisma = new PrismaClient();
  if (req.method === "GET") {
    try {
      const now = new Date();
      const utc =
        now.getTime() +
        now.getTimezoneOffset() * 60 * 1000 +
        9 * 60 * 60 * 1000;
      const nowDatetime = new Date(utc);

      const visit = await prisma.visit.findUnique({
        where: {
          year_month_day: {
            year: nowDatetime.getFullYear(),
            month: nowDatetime.getMonth() + 1,
            day: nowDatetime.getDate(),
          },
        },
      });

      // 만약 현재 방문수가 없으면 추가 후 방문수 1 반환.
      // 하지만 get 요청은 쿠키가 있는 경우이므로 방문수가 없는 경우는 비정상적인 상황임.
      if (visit) {
        res.json({ visitCount: visit.count });
      } else {
        await prisma.visit.create({
          data: {
            year: nowDatetime.getFullYear(),
            month: nowDatetime.getMonth() + 1,
            day: nowDatetime.getDate(),
            count: 1,
          },
        });
        res.json({ visitCount: 1 });
      }
    } catch (error) {
      console.log(error);
      res.status(500).send("에러발생");
    } finally {
      await prisma.$disconnect();
    }
  } else if (req.method === "POST") {
    try {
      const now = new Date();
      const utc =
        now.getTime() +
        now.getTimezoneOffset() * 60 * 1000 +
        9 * 60 * 60 * 1000;
      const nowDatetime = new Date(utc);

      const visit = await prisma.visit.findUnique({
        where: {
          year_month_day: {
            year: nowDatetime.getFullYear(),
            month: nowDatetime.getMonth() + 1,
            day: nowDatetime.getDate(),
          },
        },
      });

      if (visit) {
        const visitUpdated = await prisma.visit.update({
          where: {
            year_month_day: {
              year: nowDatetime.getFullYear(),
              month: nowDatetime.getMonth() + 1,
              day: nowDatetime.getDate(),
            },
          },
          data: {
            count: visit.count + 1,
          },
        });
        res.json({ visitCount: visitUpdated.count });
      } else {
        await prisma.visit.create({
          data: {
            year: nowDatetime.getFullYear(),
            month: nowDatetime.getMonth() + 1,
            day: nowDatetime.getDate(),
            count: 1,
          },
        });
        res.json({ visitCount: 1 });
      }
    } catch (error) {
      console.log(error);
      res.status(500).send("에러발생");
    } finally {
      await prisma.$disconnect();
    }
  }
}

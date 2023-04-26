// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { MainProps, Menu } from '@/types/MainPageType'
import { readFileSync } from 'fs';
import type { NextApiRequest, NextApiResponse } from 'next'
import path from 'path';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<MainProps|Error>
) {
  try{
    const dataDirectory = path.join(process.cwd(), 'data');
    const menuStr:string = await readFileSync(dataDirectory + "/menu.json").toString();
    const menu:Menu[] = JSON.parse(menuStr);
    res.status(200).json({ menu });
  } catch(error){
    res.status(500).send(new Error("메뉴를 찾을 수 없습니다."));
  }
}

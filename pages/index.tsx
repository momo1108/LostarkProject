import Head from 'next/head'
import Image from 'next/image'
import { Inter } from 'next/font/google'
import styles from '@/styles/Home.module.scss'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  console.log(process.env.CLIENT_TOKEN);

  return (
    <div>
      <h1>Hello</h1>
      <p className='p-8'>Nice to Meet you</p>
    </div>
  )
}

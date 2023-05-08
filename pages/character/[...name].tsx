import { useRouter } from "next/router";

export default function CharDetail() {
  const router = useRouter();
  console.log(router.asPath);

  return <div>hello</div>;
}

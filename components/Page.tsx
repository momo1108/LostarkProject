import { PageProps } from "@/types/GlobalType";
import { useRouter } from "next/router";

const Page: React.FC<PageProps> = ({ children, className, onKeyDown }) => {
  const router = useRouter();
  console.log(router);

  return (
    <div
      className={className}
      tabIndex={router.asPath === "/" ? 0 : undefined}
      onKeyDown={onKeyDown}
    >
      {children}
    </div>
  );
};

export default Page;

import { PageProps } from "@/types/GlobalType";
import { useRouter } from "next/router";

const Page: React.FC<PageProps> = ({ children, className, onKeyDown }) => {
  const router = useRouter();

  return (
    <div
      className={`hideScroll ${className}`}
      tabIndex={router.asPath === "/" ? 0 : undefined}
      onKeyDown={onKeyDown}
    >
      {children}
    </div>
  );
};

export default Page;

import { FooterProps } from "@/types/GlobalType";
import { Github } from "./icons/Index";
import Link from "next/link";
import useAlert from "@/hooks/useAlert";

const Footer: React.FC<FooterProps> = ({ children, className }) => {
  const alert = useAlert();
  return (
    <footer className={className}>
      <div className="attribution">
        {children}. Sound Effect from{" "}
        <a href="https://pixabay.com/?utm_source=link-attribution&utm_medium=referral&utm_campaign=music&utm_content=87963">
          Pixabay
        </a>
        . Sound Effect from{" "}
        <a href="https://pixabay.com/sound-effects/?utm_source=link-attribution&utm_medium=referral&utm_campaign=music&utm_content=47985">
          Pixabay
        </a>
        . Sound Effect from{" "}
        <a href="https://pixabay.com/sound-effects/?utm_source=link-attribution&utm_medium=referral&utm_campaign=music&utm_content=43861">
          Pixabay
        </a>
      </div>
      <div className="copyright">
        <div className="descr">
          <p>Copyright © {new Date().getFullYear()} Loaple</p>
        </div>
        <div className="contact">
          <p className="descr">Contact me by</p>
          <p
            title="click to copy email address"
            onClick={() => {
              window.navigator.clipboard
                .writeText("banghyechan@gmail.com")
                .then(() => {
                  alert.success("복사 완료.");
                })
                .catch((err) => {
                  console.log(err);
                });
            }}
            className="email"
          >
            banghyechan@gmail.com
          </p>
          <Link href="https://github.com/momo1108" target="_blank">
            <Github size={25} />
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

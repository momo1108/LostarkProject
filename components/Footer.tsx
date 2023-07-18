import { FooterProps } from "@/types/GlobalType";
import { Github } from "./icons/Index";
import Link from "next/link";

const Footer: React.FC<FooterProps> = ({ children, className }) => {
  return (
    <footer className={className}>
      <div className="attribution">{children}</div>
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
                  alert("복사 완료.");
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

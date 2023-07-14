import { FooterProps } from "@/types/GlobalType";

const Footer: React.FC<FooterProps> = ({ children, className }) => {
  return <footer className={className}>{children}</footer>;
};

export default Footer;

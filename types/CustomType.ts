export type IconProps = {
  size?: number;
  color?: string;
  width?: number;
  fill?: string;
  className?: string;
  type?: number;
  onClick?: React.MouseEventHandler<SVGSVGElement>;
};

export type CustomComponentProps = {
  className?: string;
  itemClassName?: string;
  title: string;
  data: any[];
  mapFunction: (arg1: any, arg2?: number) => JSX.Element;
  onClickFunction: (arg1: any, arg2?: number) => void;
  place?: string;
  offset?: number;
};

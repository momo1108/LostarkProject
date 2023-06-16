export interface PairIconProps extends IconProps {
  first?: boolean;
  fill2?: string;
}

export interface IconProps {
  size?: number;
  color?: string;
  width?: number;
  fill?: string;
  rotate?: number;
  className?: string;
  type?: number;
  onClick?: React.MouseEventHandler<SVGSVGElement>;
}

export type CustomComponentProps = {
  className?: string;
  width?: number;
  height?: number;
  color?: string;
  backgroundColor?: string;
  hoverBackgroundcolor?: string;
  borderColor?: string;
  itemClassName?: string;
  title: string;
  data: any[];
  mapFunction: (arg1: any, arg2?: number) => JSX.Element;
  onClickFunction: (arg1: any, arg2?: number) => void;
  place?: string;
  offset?: number;
};

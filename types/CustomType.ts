export interface PairIconProps extends IconProps {
  first?: boolean;
  fill2?: string;
}

export interface SpinnerIconProps extends IconProps {
  progress: number;
}

export interface IconProps {
  size?: number;
  color?: string;
  width?: number;
  fill?: string;
  rotate?: number;
  dataTooltipId?: string;
  className?: string;
  type?: number;
  onClick?: React.MouseEventHandler<SVGSVGElement>;
}

export type CustomSelectProps = {
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

export type CustomLoaderProps = {
  className?: string;
  opacity?: number;
  backgroundColor?: string;
  hide?: boolean;
  children?: (JSX.Element | string)[] | (JSX.Element | string);
};

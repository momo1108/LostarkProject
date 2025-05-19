import { HTMLInputTypeAttribute, SVGAttributes } from "react";

export interface PairIconProps extends IconProps {
  first?: boolean;
  fill2?: string;
}

export interface LoaderIconProps extends IconProps {
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
  svgAttributes?: SVGAttributes<HTMLOrSVGElement>;
}

export type CustomLoaderProps = {
  className?: string;
  opacity?: number;
  backgroundColor?: string;
  display?: string;
  children?: React.ReactNode;
};

export type CustomInputProps = {
  className?: string;
  onKeyEnter?: () => void;
  placeholder: string;
  type?: HTMLInputTypeAttribute | undefined;
  min?: number;
  max?: number;
};

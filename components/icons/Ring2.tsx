import { PairIconProps } from "@/types/CustomType";

const Ring2: React.FC<PairIconProps> = ({
  className,
  size,
  fill,
  fill2,
  first = true,
  rotate = 0,
}) => {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 30 30"
      data-license="MIT License"
      transform={`rotate(${rotate})`}
    >
      {first ? (
        <>
          <path
            transform="translate(6, 6)"
            fill={fill2}
            d="M3.5,13.5A8.5,8.5,0,1,0,14.354,5.339L15.5,3.556,14.625,2H9.375L8.5,3.556,9.646,5.339A8.509,8.509,0,0,0,3.5,13.5ZM12,7a6.5,6.5,0,1,1-6.5,6.5A6.508,6.508,0,0,1,12,7Z"
          />
          <path
            fill={fill}
            d="M3.5,13.5A8.5,8.5,0,1,0,14.354,5.339L15.5,3.556,14.625,2H9.375L8.5,3.556,9.646,5.339A8.509,8.509,0,0,0,3.5,13.5ZM12,7a6.5,6.5,0,1,1-6.5,6.5A6.508,6.508,0,0,1,12,7Z"
          />
        </>
      ) : (
        <>
          <path
            fill={fill}
            d="M3.5,13.5A8.5,8.5,0,1,0,14.354,5.339L15.5,3.556,14.625,2H9.375L8.5,3.556,9.646,5.339A8.509,8.509,0,0,0,3.5,13.5ZM12,7a6.5,6.5,0,1,1-6.5,6.5A6.508,6.508,0,0,1,12,7Z"
          />
          <path
            transform="translate(6, 6)"
            fill={fill2}
            d="M3.5,13.5A8.5,8.5,0,1,0,14.354,5.339L15.5,3.556,14.625,2H9.375L8.5,3.556,9.646,5.339A8.509,8.509,0,0,0,3.5,13.5ZM12,7a6.5,6.5,0,1,1-6.5,6.5A6.508,6.508,0,0,1,12,7Z"
          />
        </>
      )}
    </svg>
  );
};

export default Ring2;

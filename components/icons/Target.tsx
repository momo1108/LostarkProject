import { IconProps } from "@/types/CustomType";

const Target: React.FC<IconProps> = ({ className, size }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      width={size}
      height={size}
      viewBox="0 0 501.551 501.551"
    >
      <g>
        <polygon
          fill="#FFD15C"
          points="238.237,274.808 170.318,460.8 155.69,501.551 82.547,501.551 108.669,428.408    164.049,274.808  "
        />
        <polygon
          fill="#FFD15C"
          points="419.004,501.551 345.861,501.551 331.233,460.8 263.314,274.808 337.502,274.808    392.882,428.408  "
        />
      </g>
      <g>
        <path
          fill="#F8B64C"
          d="M164.049,274.808h74.188L171.363,460.8c-21.943-7.314-42.841-18.808-62.694-32.392L164.049,274.808z   "
        />
        <path
          fill="#F8B64C"
          d="M392.882,428.408c-18.808,13.584-39.706,24.033-62.694,32.392l-66.873-185.992h74.188   L392.882,428.408z"
        />
      </g>
      <circle fill="#FF7058" cx="250.776" cy="229.878" r="229.878" />
      <circle fill="#FFFFFF" cx="250.776" cy="229.878" r="180.767" />
      <circle fill="#FF7058" cx="250.776" cy="229.878" r="132.702" />
      <circle fill="#FFFFFF" cx="250.776" cy="229.878" r="84.637" />
      <circle fill="#FF7058" cx="250.776" cy="229.878" r="36.571" />
      <path
        fill="#40596B"
        d="M424.229,85.682l-167.184,149.42H256l-10.449-10.449v-1.045L412.735,73.143h1.045l9.404,10.449  C424.229,84.637,424.229,84.637,424.229,85.682z"
      />
      <g>
        <polygon
          fill="#334A5E"
          points="401.241,96.131 340.637,150.465 332.278,106.58 392.882,52.245  "
        />
        <polygon
          fill="#334A5E"
          points="383.478,163.004 444.082,109.714 401.241,96.131 340.637,150.465  "
        />
      </g>
    </svg>
  );
};

export default Target;
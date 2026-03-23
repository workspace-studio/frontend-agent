interface IconProps {
  size?: number;
  fill?: string;
  width?: number;
  height?: number;
}

const CheckboxIndeterminate = ({ size = 24, fill = 'currentColor', width, height }: IconProps) => (
  <svg width={width || size} height={height || size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="2" y="2" width="20" height="20" rx="4" fill={fill} />
    <path d="M7 12H17" stroke="white" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

export default CheckboxIndeterminate;

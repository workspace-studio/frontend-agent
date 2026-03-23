interface IconProps {
  size?: number;
  fill?: string;
  width?: number;
  height?: number;
}

const Check = ({ size = 24, fill = 'currentColor', width, height }: IconProps) => (
  <svg width={width || size} height={height || size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M9.55 18L3.85 12.3L5.275 10.875L9.55 15.15L18.725 5.975L20.15 7.4L9.55 18Z" fill={fill} />
  </svg>
);

export default Check;

interface IconProps {
  size?: number;
  fill?: string;
  width?: number;
  height?: number;
}

const RadioChecked = ({ size = 24, fill = 'currentColor', width, height }: IconProps) => (
  <svg width={width || size} height={height || size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="9.5" stroke={fill} />
    <circle cx="12" cy="12" r="5" fill={fill} />
  </svg>
);

export default RadioChecked;

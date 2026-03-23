interface IconProps {
  size?: number;
  fill?: string;
  width?: number;
  height?: number;
}

const CheckboxUnchecked = ({ size = 24, fill = 'currentColor', width, height }: IconProps) => (
  <svg width={width || size} height={height || size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="2.5" y="2.5" width="19" height="19" rx="3.5" stroke={fill} />
  </svg>
);

export default CheckboxUnchecked;

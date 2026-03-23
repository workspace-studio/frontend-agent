interface IconProps {
  size?: number;
  fill?: string;
  width?: number;
  height?: number;
}

const Close = ({ size = 24, fill = 'currentColor', width, height }: IconProps) => (
  <svg width={width || size} height={height || size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 10.586L16.95 5.636L18.364 7.05L13.414 12L18.364 16.95L16.95 18.364L12 13.414L7.05 18.364L5.636 16.95L10.586 12L5.636 7.05L7.05 5.636L12 10.586Z" fill={fill} />
  </svg>
);

export default Close;

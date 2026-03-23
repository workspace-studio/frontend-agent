interface IconProps {
  size?: number;
  fill?: string;
  width?: number;
  height?: number;
}

const Success = ({ size = 20, fill = '#2E7D32', width, height }: IconProps) => (
  <svg width={width || size} height={height || size} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M10 0C4.48 0 0 4.48 0 10C0 15.52 4.48 20 10 20C15.52 20 20 15.52 20 10C20 4.48 15.52 0 10 0ZM8 15L3 10L4.41 8.59L8 12.17L15.59 4.58L17 6L8 15Z" fill={fill} />
  </svg>
);

export default Success;

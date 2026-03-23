interface IconProps {
  size?: number;
  fill?: string;
  width?: number;
  height?: number;
}

const Warning = ({ size = 20, fill = '#ED6C02', width, height }: IconProps) => (
  <svg width={width || size} height={height || size} viewBox="0 0 22 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M0 20H22L11 0L0 20ZM12 17H10V15H12V17ZM12 13H10V9H12V13Z" fill={fill} />
  </svg>
);

export default Warning;

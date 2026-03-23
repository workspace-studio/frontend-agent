interface IconProps {
  size?: number;
  fill?: string;
  width?: number;
  height?: number;
}

const Calendar = ({ size = 24, fill = 'currentColor', width, height }: IconProps) => (
  <svg width={width || size} height={height || size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M9 1V3H15V1H17V3H21C21.5523 3 22 3.44772 22 4V20C22 20.5523 21.5523 21 21 21H3C2.44772 21 2 20.5523 2 20V4C2 3.44772 2.44772 3 3 3H7V1H9ZM20 10H4V19H20V10ZM7 5H4V8H20V5H17V7H15V5H9V7H7V5Z" fill={fill} />
  </svg>
);

export default Calendar;

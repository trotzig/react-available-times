import { HOUR_IN_PIXELS, MINUTE_IN_PIXELS } from './Constants';

export default function positionInDay(date) {
  return (
    date.getHours() * HOUR_IN_PIXELS +
    date.getMinutes() * MINUTE_IN_PIXELS
  );
}

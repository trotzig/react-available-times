import { HOUR_IN_PIXELS, MINUTE_IN_PIXELS } from './Constants';

export default function positionInDay(withinDay, date) {
  if (date.toDateString() !== withinDay.toDateString()) {
    if (date < withinDay) {
      return 0;
    }
    return 24 * HOUR_IN_PIXELS;
  }
  return (
    date.getHours() * HOUR_IN_PIXELS +
    date.getMinutes() * MINUTE_IN_PIXELS
  );
}

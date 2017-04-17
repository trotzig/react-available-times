import { HOUR_IN_PIXELS } from './Constants';

export default function toDate(day, pixelsFromTop) {
  const result = new Date(day.getTime());
  const hours = Math.floor(pixelsFromTop / HOUR_IN_PIXELS);
  const minutes = Math.ceil((pixelsFromTop % HOUR_IN_PIXELS) / HOUR_IN_PIXELS * 60);
  result.setHours(hours, minutes, 0, 0);
  return result;
}

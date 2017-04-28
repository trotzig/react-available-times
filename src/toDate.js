import momentTimezone from 'moment-timezone';

import { HOUR_IN_PIXELS } from './Constants';

export default function toDate(day, pixelsFromTop, timeZone) {
  if (!timeZone) {
    throw new Error('Missing timeZone');
  }
  const m = momentTimezone.tz(day, timeZone);
  const hours = Math.floor(pixelsFromTop / HOUR_IN_PIXELS);
  const minutes = Math.ceil((pixelsFromTop % HOUR_IN_PIXELS) / HOUR_IN_PIXELS * 60);
  m.hour(hours).minutes(minutes).seconds(0).milliseconds(0);
  return m.toDate();
}

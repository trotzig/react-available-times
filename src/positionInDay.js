import momentTimezone from 'moment-timezone';

import { HOUR_IN_PIXELS, MINUTE_IN_PIXELS } from './Constants';
import inSameDay from './inSameDay';

export default function positionInDay(withinDay, date, timeZone) {
  if (!timeZone) {
    throw new Error('Missing timeZone');
  }
  if (!inSameDay(date, withinDay, timeZone)) {
    if (date < withinDay) {
      return 0;
    }
    return 24 * HOUR_IN_PIXELS;
  }
  const mom = momentTimezone.tz(date, timeZone);
  return (
    mom.hours() * HOUR_IN_PIXELS +
    mom.minutes() * MINUTE_IN_PIXELS
  );
}

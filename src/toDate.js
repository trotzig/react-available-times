import moment from 'moment';

import { HOUR_IN_PIXELS } from './Constants';

export default function toDate(day, pixelsFromTop) {
  const m = moment(day);
  const hours = Math.floor(pixelsFromTop / HOUR_IN_PIXELS);
  const minutes = Math.ceil((pixelsFromTop % HOUR_IN_PIXELS) / HOUR_IN_PIXELS * 60);
  m.hour(hours).minutes(minutes).seconds(0).milliseconds(0);
  return m.toDate();
}

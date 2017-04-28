// We're only using moment here to construct strings from 0am to 12pm. There's
// no need to use time zones.
import moment from 'moment';

function formatTime(date, timeConvention) {
  if (timeConvention === '12h') {
    return date.format('ha');
  }
  return date.format('HH');
}

export default function hours(timeConvention) {
  const result = [];
  const date = moment().minutes(0).seconds(0).milliseconds(0);
  for (let i = 0; i < 24; i++) {
    date.hour(i)
    result.push(formatTime(date, timeConvention));
  }
  return result;
}

import moment from 'moment';

import dateIntervalString from './dateIntervalString';

export default function weekAt(weekStartsOn, atDate) {
  // Create a copy so that we're not mutating the original
  const date = moment(atDate);

  // Set the clock to noon so that calculations to get following/previous days
  // work despite daylight savings time. We have to use local time (as opposed
  // to `setHoursUTC` so that we're not accidentally changing the date.
  date.hour(12).minute(0).second(0).millisecond(0);
  date.day(weekStartsOn === 'monday' ? 1 : 0);

  const start = moment(date);
  start.hour(0);

  const days = [];
  for (let i = 0; i < 7; i++) {
    days.push({
      date: date.toDate(),
      name: date.format('dddd'),
      abbreviated: date.format('ddd'),
    });
    date.weekday(date.weekday() + 1);
  }
  const end = moment(date);
  end.hour(0);
  return {
    interval: dateIntervalString(days[0].date, days[days.length - 1].date),
    days,
    start: start.toDate(),
    end: end.toDate(),
  };
}

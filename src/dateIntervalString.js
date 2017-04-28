import momentTimezone from 'moment-timezone';

export default function dateIntervalString(fromDate, toDate, timeZone) {
  const from = momentTimezone.tz(fromDate, timeZone);
  const to = momentTimezone.tz(toDate, timeZone);
  if (from.month() === to.month()) {
    return [
      from.format('MMMM D'),
      '–', // en dash
      to.format('D'),
    ].join(' ');
  }
  return [
    from.format('MMM D'),
    '–', // en dash
    to.format('MMM D'),
  ].join(' ');
}

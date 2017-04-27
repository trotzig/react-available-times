import moment from 'moment';

export default function dateIntervalString(fromDate, toDate) {
  const from = moment(fromDate);
  const to = moment(toDate);
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

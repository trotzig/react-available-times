const monthNames = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

export default function dateIntervalString(from, to) {
  const fromMonth = monthNames[from.getMonth()];
  const toMonth = monthNames[to.getMonth()];

  if (fromMonth === toMonth) {
    return [
      fromMonth,
      from.getDate(),
      '–', // en dash
      to.getDate(),
    ].join(' ');
  }
  return [
    fromMonth.substr(0, 3),
    from.getDate(),
    '–', // en dash
    toMonth.substr(0, 3),
    to.getDate(),
  ].join(' ');
}

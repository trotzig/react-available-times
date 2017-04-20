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

  const result = [
    fromMonth,
    from.getDate(),
    '–', // en dash
  ];
  if (fromMonth !== toMonth) {
    result.push(toMonth);
  }
  result.push(to.getDate());
  return result.join(' ');
}

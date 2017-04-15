const names = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
];
const abbreviatedNames = [
  'Sun',
  'Mon',
  'Tue',
  'Wed',
  'Thu',
  'Fri',
  'Sat',
];

export default function weekAt(atDate) {
  // Create a copy so that we're not mutating the original
  const date = new Date(atDate.getTime());

  // Set the clock to noon so that calculations to get following/previous days
  // work despite daylight savings time. We have to use local time (as opposed
  // to `setHoursUTC` so that we're not accidentally changing the date.
  date.setHours(12, 0, 0, 0);

  // Go back to Sunday so we can start iterating from there.
  while (date.getDay() > 0) {
    date.setDate(date.getDate() - 1);
  }

  const result = [];
  for (let i = 0; i < names.length; i++) {
    result.push({
      date: new Date(date.getTime()),
      name: names[date.getDay()],
      abbreviated: abbreviatedNames[date.getDay()],
    });
    date.setDate(date.getDate() + 1);
  }
  return result;
}

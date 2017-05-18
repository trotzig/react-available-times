import momentTimezone from 'moment-timezone';

import weekAt from './weekAt';

export default function normalizeRecurringSelections(
  selections,
  timeZone,
  weekStartsOn,
) {
  if (!timeZone) {
    throw new Error('Missing timeZone');
  }
  if (!weekStartsOn) {
    throw new Error('Missing weekStartsOn');
  }

  const weekStart = momentTimezone.tz(new Date(), timeZone)
    .hour(0)
    .minute(0)
    .seconds(0)
    .milliseconds(0);
  weekStart.day(weekStartsOn === 'monday' ? 1 : 0);

  // To avoid DST issues, move to the first week of the year (which should be
  // DST free).
  weekStart.week(1);

  const midCurrentWeek = momentTimezone.tz(
    weekAt(weekStartsOn, new Date(), timeZone).days[3].date,
    timeZone,
  );

  return selections.map(({ start, end }) => {
    const startM = momentTimezone.tz(weekStart, timeZone);
    const endM = momentTimezone.tz(weekStart, timeZone);
    startM.week(midCurrentWeek.week());
    endM.week(midCurrentWeek.week());
    startM.add(start, 'minutes');
    endM.add(end, 'minutes');
    return {
      start: startM.toDate(),
      end: endM.toDate(),
    };
  });
}

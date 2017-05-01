import momentTimezone from 'moment-timezone';

import makeRecurring from '../src/makeRecurring';

it('converts to minutes from start of week', () => {
  const m = momentTimezone.tz('Europe/Stockholm')
    .day(0)
    .hours(3)
    .minutes(0)
    .seconds(0)
    .milliseconds(0);
  const start = m.toDate();
  const end = m.add(1, 'hour').toDate();

  expect(makeRecurring({ start, end }, 'Europe/Stockholm', 'sunday')).toEqual({
    start: 180,
    end: 240,
  });

  expect(makeRecurring({ start, end }, 'Europe/Stockholm', 'monday')).toEqual({
    start: 8820,
    end: 8880,
  });
});

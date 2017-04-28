import weekAt from '../src/weekAt';

it('returns a week', () => {
  const week = weekAt('sunday', new Date('Sun Mar 26 2017 01:22:53 GMT+0200'), 'Europe/Stockholm');
  expect(week.interval).toEqual('Mar 26 – Apr 1')
  expect(week.start).toEqual(new Date('Sun Mar 26 2017 00:00:00 GMT+0100'));
  expect(week.end).toEqual(new Date('Sun Apr 2 2017 00:00:00 GMT+0200'));
  expect(week.days).toEqual([
    {
      abbreviated: 'Sun',
      name: 'Sunday',
      date: new Date('Sun Mar 26 2017 12:00:00 GMT+0200'),
    },
    {
      abbreviated: 'Mon',
      name: 'Monday',
      date: new Date('Mon Mar 27 2017 12:00:00 GMT+0200'),
    },
    {
      abbreviated: 'Tue',
      name: 'Tuesday',
      date: new Date('Tue Mar 28 2017 12:00:00 GMT+0200'),
    },
    {
      abbreviated: 'Wed',
      name: 'Wednesday',
      date: new Date('Wed Mar 29 2017 12:00:00 GMT+0200'),
    },
    {
      abbreviated: 'Thu',
      name: 'Thursday',
      date: new Date('Thu Mar 30 2017 12:00:00 GMT+0200'),
    },
    {
      abbreviated: 'Fri',
      name: 'Friday',
      date: new Date('Fri Mar 31 2017 12:00:00 GMT+0200'),
    },
    {
      abbreviated: 'Sat',
      name: 'Saturday',
      date: new Date('Sat Apr 1 2017 12:00:00 GMT+0200'),
    },
  ]);
});

it('can take a timezone a week', () => {
  const week = weekAt('sunday', new Date('Mon Mar 27 2017 01:22:53 GMT+0200'), 'America/Los_Angeles');
  expect(week.interval).toEqual('Mar 26 – Apr 1')
  expect(week.start).toEqual(new Date('Sun Mar 26 2017 08:00:00 GMT+0100'));
  expect(week.end).toEqual(new Date('Sun Apr 2 2017 09:00:00 GMT+0200'));
  expect(week.days).toEqual([
    {
      abbreviated: 'Sun',
      name: 'Sunday',
      date: new Date('Sun Mar 26 2017 21:00:00 GMT+0200'),
    },
    {
      abbreviated: 'Mon',
      name: 'Monday',
      date: new Date('Mon Mar 27 2017 21:00:00 GMT+0200'),
    },
    {
      abbreviated: 'Tue',
      name: 'Tuesday',
      date: new Date('Tue Mar 28 2017 21:00:00 GMT+0200'),
    },
    {
      abbreviated: 'Wed',
      name: 'Wednesday',
      date: new Date('Wed Mar 29 2017 21:00:00 GMT+0200'),
    },
    {
      abbreviated: 'Thu',
      name: 'Thursday',
      date: new Date('Thu Mar 30 2017 21:00:00 GMT+0200'),
    },
    {
      abbreviated: 'Fri',
      name: 'Friday',
      date: new Date('Fri Mar 31 2017 21:00:00 GMT+0200'),
    },
    {
      abbreviated: 'Sat',
      name: 'Saturday',
      date: new Date('Sat Apr 1 2017 21:00:00 GMT+0200'),
    },
  ]);
});

it('can start on a monday', () => {
  const week = weekAt('monday', new Date('Wed Mar 29 2017 01:22:53 GMT+0200'), 'Europe/Stockholm');
  expect(week.interval).toEqual('Mar 27 – Apr 2')
  expect(week.start).toEqual(new Date('Mon Mar 27 2017 00:00:00 GMT+0200'));
  expect(week.end).toEqual(new Date('Mon Apr 3 2017 00:00:00 GMT+0200'));
  expect(week.days).toEqual([
    {
      abbreviated: 'Mon',
      name: 'Monday',
      date: new Date('Mon Mar 27 2017 12:00:00 GMT+0200'),
    },
    {
      abbreviated: 'Tue',
      name: 'Tuesday',
      date: new Date('Tue Mar 28 2017 12:00:00 GMT+0200'),
    },
    {
      abbreviated: 'Wed',
      name: 'Wednesday',
      date: new Date('Wed Mar 29 2017 12:00:00 GMT+0200'),
    },
    {
      abbreviated: 'Thu',
      name: 'Thursday',
      date: new Date('Thu Mar 30 2017 12:00:00 GMT+0200'),
    },
    {
      abbreviated: 'Fri',
      name: 'Friday',
      date: new Date('Fri Mar 31 2017 12:00:00 GMT+0200'),
    },
    {
      abbreviated: 'Sat',
      name: 'Saturday',
      date: new Date('Sat Apr 1 2017 12:00:00 GMT+0200'),
    },
    {
      abbreviated: 'Sun',
      name: 'Sunday',
      date: new Date('Sun Apr 2 2017 12:00:00 GMT+0200'),
    },
  ]);
});

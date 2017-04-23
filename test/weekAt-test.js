import weekAt from '../src/weekAt';

it('returns a week', () => {
  const week = weekAt(new Date('Sun Mar 26 2017 01:22:53 GMT+0200'));
  expect(week.interval).toEqual('March 26 – April 1')
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

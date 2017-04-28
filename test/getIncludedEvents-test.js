import getIncludedEvents from '../src/getIncludedEvents';

const events = [
  {
    start: new Date('Sun Mar 26 2017 12:00:00 GMT+0200'),
    end: new Date('Sun Mar 26 2017 14:00:00 GMT+0200'),
  },
  {
    start: new Date('Sun Mar 26 2017 20:00:00 GMT+0200'),
    end: new Date('Mon Mar 27 2017 00:00:00 GMT+0200'),
  },
  {
    start: new Date('Sun Mar 26 2017 00:00:00 GMT+0200'),
    end: new Date('Tue Mar 28 2017 00:00:00 GMT+0200'),
    allDay: true,
  },
  {
    start: new Date('Mon Mar 27 2017 00:00:00 GMT+0200'),
    end: new Date('Tue Mar 28 2017 00:00:00 GMT+0200'),
    allDay: true,
  },
  {
    start: new Date('Mon Mar 27 2017 20:00:00 GMT+0200'),
    end: new Date('Tue Mar 28 2017 10:00:00 GMT+0200'),
  },
];

it('includes the right events for day one', () => {
  const dayStart = new Date('Sun Mar 26 2017 00:00:00 GMT+0200');
  const dayEnd = new Date('Mon Mar 27 2017 00:00:00 GMT+0200');
  expect(getIncludedEvents(events, dayStart, dayEnd)).toEqual([
    {
      start: new Date('Sun Mar 26 2017 12:00:00 GMT+0200'),
      end: new Date('Sun Mar 26 2017 14:00:00 GMT+0200'),
    },
    {
      start: new Date('Sun Mar 26 2017 20:00:00 GMT+0200'),
      end: new Date('Mon Mar 27 2017 00:00:00 GMT+0200'),
    },
    {
      start: new Date('Sun Mar 26 2017 00:00:00 GMT+0200'),
      end: new Date('Tue Mar 28 2017 00:00:00 GMT+0200'),
      allDay: true,
    },
  ]);
});

it('includes the right events for day two', () => {
  const dayStart = new Date('Mon Mar 27 2017 00:00:00 GMT+0200');
  const dayEnd = new Date('Tue Mar 28 2017 00:00:00 GMT+0200');
  expect(getIncludedEvents(events, dayStart, dayEnd)).toEqual([
    {
      start: new Date('Sun Mar 26 2017 00:00:00 GMT+0200'),
      end: new Date('Tue Mar 28 2017 00:00:00 GMT+0200'),
      allDay: true,
    },
    {
      start: new Date('Mon Mar 27 2017 00:00:00 GMT+0200'),
      end: new Date('Tue Mar 28 2017 00:00:00 GMT+0200'),
      allDay: true,
    },
    {
      start: new Date('Mon Mar 27 2017 20:00:00 GMT+0200'),
      end: new Date('Tue Mar 28 2017 10:00:00 GMT+0200'),
    },
  ]);
});

it('includes the right events for day three', () => {
  const dayStart = new Date('Tue Mar 28 2017 00:00:00 GMT+0200');
  const dayEnd = new Date('Wed Mar 29 2017 00:00:00 GMT+0200');
  expect(getIncludedEvents(events, dayStart, dayEnd)).toEqual([
    {
      start: new Date('Mon Mar 27 2017 20:00:00 GMT+0200'),
      end: new Date('Tue Mar 28 2017 10:00:00 GMT+0200'),
    },
  ]);
});

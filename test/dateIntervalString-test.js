import dateIntervalString from '../src/dateIntervalString';

const march28 = new Date('Tue Mar 28 2017 12:00:00 GMT+0200');
const march30 = new Date('Thu Mar 30 2017 12:00:00 GMT+0200');
const april1 = new Date('Sat Apr 1 2017 12:00:00 GMT+0200');

it('reuses the month name if in same month', () => {
  expect(dateIntervalString(march28, march30)).toEqual('March 28 – 30');
});

it('shows both month names if in different months', () => {
  expect(dateIntervalString(march28, april1)).toEqual('March 28 – April 1');
});

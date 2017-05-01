import { HOUR_IN_PIXELS } from '../src/Constants';
import toDate from '../src/toDate';

it('sets the right hour', () => {
  const expected = new Date();
  expected.setHours(4, 0, 0, 0);
  expect(toDate(new Date(), HOUR_IN_PIXELS * 4, 'Europe/Stockholm')).toEqual(expected);
});

it('sets the right minute', () => {
  const expected = new Date();
  expected.setHours(23, 15, 0, 0);
  expect(toDate(new Date(), (HOUR_IN_PIXELS * 23) + (HOUR_IN_PIXELS / 4), 'Europe/Stockholm'))
    .toEqual(expected);
});

it('rounds up', () => {
  const expected = new Date();
  expected.setHours(23, 15, 0, 0);
  expect(toDate(new Date(), (HOUR_IN_PIXELS * 23) + ((HOUR_IN_PIXELS / 4) - 0.1343), 'Europe/Stockholm'))
    .toEqual(expected);
});

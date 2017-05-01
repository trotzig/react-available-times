import momentTimezone from 'moment-timezone';

import { HOUR_IN_PIXELS } from '../src/Constants';
import toDate from '../src/toDate';

it('sets the right hour', () => {
  const expected = momentTimezone.tz('2017-05-01T07:33:11.722Z', 'Europe/Stockholm')
    .hours(4).minutes(0).seconds(0)
    .milliseconds(0)
    .toDate();
  expect(toDate(expected, HOUR_IN_PIXELS * 4, 'Europe/Stockholm')).toEqual(expected);
});

it('sets the right minute', () => {
  const expected = momentTimezone.tz('2017-05-01T07:33:11.722Z', 'Europe/Stockholm')
    .hours(23).minutes(15).seconds(0)
    .milliseconds(0)
    .toDate();
  expect(toDate(expected, (HOUR_IN_PIXELS * 23) + (HOUR_IN_PIXELS / 4), 'Europe/Stockholm'))
    .toEqual(expected);
});

it('rounds up', () => {
  const expected = momentTimezone.tz('2017-05-01T07:33:11.722Z', 'Europe/Stockholm')
    .hours(23).minutes(15).seconds(0)
    .milliseconds(0)
    .toDate();
  expect(toDate(expected, (HOUR_IN_PIXELS * 23) + ((HOUR_IN_PIXELS / 4) - 0.1343), 'Europe/Stockholm'))
    .toEqual(expected);
});

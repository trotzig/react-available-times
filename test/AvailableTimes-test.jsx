import { mount } from 'enzyme';
import React from 'react';

import AvailableTimes from '../src/AvailableTimes';
import CalendarSelector from '../src/CalendarSelector';

it('works with no props', () => {
  expect(() => mount(<AvailableTimes />)).not.toThrowError();
});

it('does not render a calendar selector', () => {
  expect(mount(<AvailableTimes />).find(CalendarSelector).length).toBe(0);
});

describe('with calendars', () => {
  it('does not render a calendar selector', () => {
    expect(mount(<AvailableTimes calendars={[{ id: '1' }]} />)
      .find(CalendarSelector).length).toBe(1);
  });
});

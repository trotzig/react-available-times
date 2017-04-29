import { mount } from 'enzyme';
import React from 'react';

import AvailableTimes from '../src/AvailableTimes';
import CalendarSelector from '../src/CalendarSelector';
import Week from '../src/Week';

describe('without props', () => {
  it('works with no props', () => {
    expect(() => mount(<AvailableTimes />)).not.toThrowError();
  });

  it('does not render a calendar selector', () => {
    expect(mount(<AvailableTimes />).find(CalendarSelector).length).toBe(0);
  });

  it('has days from sunday-saturday', () => {
    expect(mount(<AvailableTimes />).find(Week).first().text()).toMatch(/Sun.*Mon.*Tue/)
    expect(mount(<AvailableTimes />).find(Week).first().text()).not.toMatch(/Sat.*Sun/)
  });
});

describe('with weekStartsOn=monday', () => {
  const week = mount(<AvailableTimes weekStartsOn='monday' />).find(Week).first();
    expect(week.text()).not.toMatch(/Sun.*Mon.*Tue/)
    expect(week.text()).toMatch(/Sat.*Sun/)
});

describe('with calendars', () => {
  it('renders a calendar selector', () => {
    expect(mount(<AvailableTimes calendars={[{ id: '1' }]} />)
      .find(CalendarSelector).length).toBe(1);
  });
});

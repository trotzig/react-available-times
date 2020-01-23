import { mount } from 'enzyme';
import React from 'react';
import moment from 'moment';
import momentTimezone from 'moment-timezone';

import AvailableTimes from '../src/AvailableTimes';
import CalendarSelector from '../src/CalendarSelector';
import DayHeader from '../src/DayHeader';
import Ruler from '../src/Ruler';
import Slider from '../src/Slider';
import Week from '../src/Week';
import weekAt from '../src/weekAt';

it('works with no props', () => {
  expect(() => mount(<AvailableTimes />)).not.toThrowError();
});

it('does not render a calendar selector without props', () => {
  expect(mount(<AvailableTimes />).find(CalendarSelector).length).toBe(0);
});

it('uses 24h time convention', () => {
  const start = moment();
  const component = mount(
    <AvailableTimes
      initialSelections={[
        {
          start: start.hour(13).minutes(0).seconds(0).toDate(),
          end: start.add(1, 'hour').toDate(),
        },
      ]}
    />,
  );
  expect(component.find(Ruler).first().text()).toMatch(/12.*13.*14/);
  expect(component.text()).toMatch(/13:00-14:00/);
});

it('has days from sunday-saturday', () => {
  const week = mount(<AvailableTimes />).find(Week).first();
  expect(week.text()).toMatch(/Sun.*Mon.*Tue/);
  expect(week.text()).not.toMatch(/Sat.*Sun/);
});

it('asks for events as part of mounting', (done) => {
  const handleEventsRequested = jest.fn();
  mount(
    <AvailableTimes
      calendars={[
        { id: 'a', selected: true },
        { id: 'b', selected: true },
        { id: 'c', selected: false },
      ]}
      onEventsRequested={handleEventsRequested}
    />,
  );
  setTimeout(() => {
    // fetching is deferred in the component so we need to do the same thing
    // here.
    expect(handleEventsRequested).toHaveBeenCalledWith(expect.objectContaining({
      calendarId: 'a',
    }));
    expect(handleEventsRequested).toHaveBeenCalledWith(expect.objectContaining({
      calendarId: 'b',
    }));
    expect(handleEventsRequested).not.toHaveBeenCalledWith(expect.objectContaining({
      calendarId: 'c',
    }));
    done();
  });
});

it('has days monday-sunday when weekStartsOn=monday', () => {
  const week = mount(<AvailableTimes weekStartsOn="monday" />).find(Week).first();
  expect(week.text()).not.toMatch(/Sun.*Mon.*Tue/);
  expect(week.text()).toMatch(/Sat.*Sun/);
});

it('renders a calendar selector when calendars is present', () => {
  expect(mount(<AvailableTimes calendars={[{ id: '1' }]} />)
    .find(CalendarSelector).length).toBe(1);
});

it('uses 12h time convention when timeConvention=12h', () => {
  const start = moment();
  const component = mount(
    <AvailableTimes
      timeConvention="12h"
      initialSelections={[
        {
          start: start.hour(13).minutes(0).seconds(0).toDate(),
          end: start.add(1, 'hour').toDate(),
        },
      ]}
    />,
  );
  expect(component.find(Ruler).first().text()).toMatch(/12pm.*01pm.*02pm/);
  expect(component.text()).toMatch(/01:00pm-02:00pm/);
});

it('can display in a different timeZone', () => {
  // Create a date in CET, so that we can compare the output and make sure it's
  // in a different time zone.
  const start = momentTimezone.tz(new Date(), 'Europe/Stockholm');
  const component = mount(
    <AvailableTimes
      timeZone="Pacific/Samoa"
      initialSelections={[
        {
          start: start.hour(13).minutes(0).seconds(0).toDate(),
          end: start.add(1, 'hour').toDate(),
        },
      ]}
    />,
  );

  expect(component.text()).toMatch(/01:00-02:00/);
  // Make sure that sunday is the first day
  expect(component.find(DayHeader).first().text()).toMatch(/Sun/);
});

it('can be in recurring mode', () => {
  const weekTitle = weekAt('sunday', new Date(), 'Europe/Stockholm').interval;
  // First, just make sure that we're making the right assumption about the
  // title:
  expect(mount(<AvailableTimes />).text()).toMatch(weekTitle);

  const component = mount(<AvailableTimes recurring />);
  expect(component.text()).not.toMatch(weekTitle);
  expect(component.find(Week).length).toBe(1);
  expect(component.find(Slider).props().disabled).toBe(true);
  expect(component.find(DayHeader).first().props().hideDates).toBe(true);
});

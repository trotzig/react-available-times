import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';

import { HOUR_IN_PIXELS } from './Constants';
import Day from './Day';
import DayHeader from './DayHeader';
import Ruler from './Ruler';
import addOverlapHints from './addOverlapHints';
import styles from './Week.css';

function flatten(selections) {
  const result = [];
  selections.forEach((selectionsInDay) => {
    result.push(...selectionsInDay);
  });
  return result;
}

function getDayEvents(events, date) {
  const dateString = date.toDateString();
  return events.filter(({ start }) => {
    return dateString === start.toDateString();
  });
}

function constructStateFromProps({ week, initialSelections, events }) {
  const daySelections = [];
  const dayEvents = [];
  week.days.forEach(({ date }) => {
    daySelections.push(getDayEvents(initialSelections || [], date));
    dayEvents.push(getDayEvents(events || [], date));
  });
  return {
    dayEvents,
    daySelections,
  };
}

export default class Week extends PureComponent {
  constructor(props) {
    super();
    this.state = constructStateFromProps(props);
    this.handleDayChange = this.handleDayChange.bind(this);
  }

  componentWillReceiveProps(newProps) {
    if (newProps.events === this.props.events) {
      // nothing changed
      return;
    }
    this.setState(constructStateFromProps(newProps));
  }

  handleDayChange(day, selections) {
    this.setState(({ daySelections }) => {
      const { onChange } = this.props;
      if (!onChange) {
        return;
      }
      daySelections[day.getDay()] = selections;
      onChange(this.props.week, flatten(daySelections));
      return { daySelections };
    });
  }

  render() {
    const {
      start,
      week,
    } = this.props;

    const { dayEvents, daySelections } = this.state;

    return (
      <div className={styles.component}>
        <div className={styles.header}>
          {week.days.map((day) => (
            <DayHeader
              day={day}
              key={day.date}
            />
          ))}
        </div>
        <div
          className={styles.days}
          ref={(element) => {
            if (!element || this.alreadyScrolled) {
              return;
            }
            this.alreadyScrolled = true;
            element.scrollTop = HOUR_IN_PIXELS * 6.5;
          }}
        >
          <Ruler />
          {week.days.map((day, i) => (
            <Day
              key={day.date}
              date={day.date}
              events={dayEvents[i]}
              initialSelections={daySelections[i]}
              onChange={this.handleDayChange}
            />
          ))}
        </div>
      </div>
    );
  }
}

Week.propTypes = {
  events: PropTypes.arrayOf(PropTypes.shape({
    start: PropTypes.instanceOf(Date),
    end: PropTypes.instanceOf(Date),
    label: PropTypes.string,
    backgroundColor: PropTypes.string,
    foregroundColor: PropTypes.string,
    offset: PropTypes.number,
    width: PropTypes.number,
  })),
  initialSelections: PropTypes.arrayOf(PropTypes.shape({
    start: PropTypes.instanceOf(Date),
    end: PropTypes.instanceOf(Date),
  })),
  onChange: PropTypes.func,
  week: PropTypes.object.isRequired,
};

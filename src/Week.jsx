import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';

import Day from './Day';
import DayHeader from './DayHeader';
import Ruler from './Ruler';
import addOverlapHints from './addOverlapHints';
import styles from './Week.css';

function flatten(selections) {
  const result = [];
  Object.keys(selections).forEach((dayOfWeek) => {
    result.push(...selections[dayOfWeek]);
  });
  return result;
}

function getDayEvents(events, date) {
  const dateString = date.toDateString();
  return events.filter(({ start }) => {
    return dateString === start.toDateString();
  });
}

export default class Week extends PureComponent {
  constructor({ week, initialSelections }) {
    super();
    this.selections = {};
    week.days.forEach(({ date }) => {
      this.selections[date.getDay()] = getDayEvents(initialSelections || [], date);
    });
  }

  componentDidMount() {
    // Place scroll at 06:30 in the morning
    this._daysRef.scrollTop = 325;
  }

  handleDayChange(day, selections) {
    const { onChange } = this.props;
    this.selections[day.getDay()] = selections;
    if (!onChange) {
      return;
    }
    onChange(flatten(this.selections));
  }

  render() {
    const {
      events,
      initialSelections,
      start,
      week,
    } = this.props;

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
        <div className={styles.daysWrapper}>
          <div
            className={styles.days}
            ref={(element) => this._daysRef = element}
          >
            <Ruler />
            {week.days.map((day) => (
              <Day
                key={day.date}
                date={day.date}
                events={addOverlapHints(getDayEvents(events || [], day.date))}
                initialSelections={getDayEvents(initialSelections || [], day.date)}
                onChange={this.handleDayChange.bind(this, day.date)}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }
}

Week.propTypes = {
  week: PropTypes.object.isRequired,
  initialSelections: PropTypes.arrayOf(PropTypes.shape({
    start: PropTypes.instanceOf(Date),
    end: PropTypes.instanceOf(Date),
  })),
  events: PropTypes.arrayOf(PropTypes.shape({
    start: PropTypes.instanceOf(Date),
    end: PropTypes.instanceOf(Date),
    label: PropTypes.string,
    color: PropTypes.string,
  })),
  onChange: PropTypes.func,
};

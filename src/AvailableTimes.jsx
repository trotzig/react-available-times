import PropTypes from 'prop-types';
import React, { Component } from 'react';

import Week from './Week';
import styles from './AvailableTimes.css';
import weekAt from './weekAt';

function oneWeekAhead(date) {
  const result = new Date(date.getTime());
  result.setDate(date.getDate() + 7);
  return result;
}

export default class AvailableTimes extends Component {
  constructor({ start }) {
    super();
    this.state = {
      weeks: [
        weekAt(start),
        weekAt(oneWeekAhead(start)),
      ],
      currentWeekIndex: 0,
    };
  }

  handleChange(week, selections) {

  }

  handleNavClick(increment) {
    this.setState(({ currentWeekIndex, weeks }) => {
      const nextIndex = currentWeekIndex + increment;
      if (nextIndex < 0) {
        return;
      }
      let nextWeeks;
      if (weeks[nextIndex]) {
        nextWeeks = weeks;
      } else {
        nextWeeks = weeks.concat(weekAt(
          oneWeekAhead(weeks[weeks.length - 1].days[3].date)));
      }
      return {
        weeks: nextWeeks,
        currentWeekIndex: nextIndex,
      };
    });
  }

  render() {
    const {
      events,
      height,
      initialSelections,
    } = this.props;

    const {
      currentWeekIndex,
      weeks,
    } = this.state;

    return (
      <div
        className={styles.component}
        style={{
          height,
        }}
      >
        <div className={styles.toolbar}>
          <button onClick={this.handleNavClick.bind(this, -1)}>
            &lt;
          </button>
          {' '}
          <button onClick={this.handleNavClick.bind(this, 1)}>
            &gt;
          </button>
          {' '}
          {weeks[currentWeekIndex].interval}
        </div>
        <div className={styles.main}>
          {weeks.map((week, i) => (
            <Week
              active={currentWeekIndex === i}
              key={week.days[0].date}
              week={week}
              events={events}
              initialSelections={initialSelections}
              onChange={this.handleChange.bind(this, week)}
              height={height}
            />
          ))}
        </div>
      </div>
    );
  }
}

AvailableTimes.propTypes = {
  start: PropTypes.instanceOf(Date),
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
  height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

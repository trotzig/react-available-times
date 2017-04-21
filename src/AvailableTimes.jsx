import PropTypes from 'prop-types';
import React, { Component } from 'react';

import Week from './Week';
import addOverlapHints from './addOverlapHints';
import styles from './AvailableTimes.css';
import weekAt from './weekAt';

function oneWeekAhead(date) {
  const result = new Date(date.getTime());
  result.setDate(date.getDate() + 7);
  return result;
}

function flatten(selections) {
  const result = [];
  Object.keys(selections).forEach((date) => {
    result.push(...selections[date]);
  });
  return result;
}

export default class AvailableTimes extends Component {
  constructor({ start = new Date(), events = [] }) {
    super();
    this.state = {
      weeks: [
        weekAt(start),
        weekAt(oneWeekAhead(start)),
      ],
      currentWeekIndex: 0,
      overlappedEvents: addOverlapHints(events),
    };
    this.selections = {};
    this.handleWeekChange = this.handleWeekChange.bind(this);
  }

  componentWillReceiveProps({ events }) {
    if (events === this.props.events) {
      // nothing to do
      return;
    }
    this.setState({
      overlappedEvents: addOverlapHints(events),
    });
  }

  handleWeekChange(week, selections) {
    const { onChange } = this.props;
    this.selections[week.days[0].date] = selections;
    if (!onChange) {
      return;
    }
    onChange(flatten(this.selections));
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
          <div className={styles.buttons}>
            <button onClick={this.handleNavClick.bind(this, -1)}>
              &lt;
            </button>
            {' '}
            <button onClick={this.handleNavClick.bind(this, 1)}>
              &gt;
            </button>
          </div>
          <div className={styles.interval}>
            {weeks[currentWeekIndex].interval}
          </div>
        </div>
        <div className={styles.main}>
          {weeks.map((week, i) => (
            <Week
              active={currentWeekIndex === i}
              key={week.days[0].date}
              week={week}
              events={this.state.overlappedEvents}
              initialSelections={initialSelections}
              onChange={this.handleWeekChange}
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

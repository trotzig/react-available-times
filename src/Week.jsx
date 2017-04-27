import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import moment from 'moment';

import { HOUR_IN_PIXELS, RULER_WIDTH_IN_PIXELS } from './Constants';
import Day from './Day';
import DayHeader from './DayHeader';
import Ruler from './Ruler';
import getIncludedEvents from './getIncludedEvents';
import styles from './Week.css';

function flatten(selections) {
  const result = [];
  selections.forEach((selectionsInDay) => {
    result.push(...selectionsInDay);
  });
  return result;
}

function getIncludedItems(week, items) {
  const result = [];
  week.days.forEach(({ date }) => {
    const startMoment = moment(date).hour(0);
    const end = moment(startMoment).date(startMoment.date() + 1).toDate();
    const start = startMoment.toDate();
    result.push(getIncludedEvents(items || [], start, end));
  });
  return result
}

export default class Week extends PureComponent {
  constructor({ week, events, initialSelections }) {
    super();
    this.state = {
      dayEvents: getIncludedItems(week, events),
      daySelections: getIncludedItems(week, initialSelections),
    }
    this.handleDayChange = this.handleDayChange.bind(this);
  }

  componentWillReceiveProps({ week, events }) {
    if (events === this.props.events) {
      // nothing changed
      return;
    }
    this.setState({
      dayEvents: getIncludedItems(week, events),
    });
  }

  handleDayChange(dayIndex, selections) {
    this.setState(({ daySelections }) => {
      const { onChange } = this.props;
      if (!onChange) {
        return;
      }
      daySelections[dayIndex] = selections;
      const flattened = flatten(daySelections);
      onChange(this.props.week, flattened);
      return { daySelections };
    });
  }

  renderLines() {
    const result = [];
    for (let i = 0; i < 24; i++) {
      result.push(
        <div
          key={i}
          className={styles.hour}
          style={{
            height: HOUR_IN_PIXELS,
          }}
        >
          <div className={styles.halfHour} />
        </div>
      );
    }
    return result;
  }

  render() {
    const {
      start,
      week,
      availableWidth,
      timeConvention,
    } = this.props;

    const { dayEvents, daySelections } = this.state;

    return (
      <div className={styles.component}>
        <div
          className={styles.header}
          style={{
            paddingLeft: RULER_WIDTH_IN_PIXELS,
          }}
        >
          {week.days.map((day, i) => (
            <DayHeader
              availableWidth={(availableWidth - RULER_WIDTH_IN_PIXELS) / 7}
              day={day}
              key={day.date}
              events={dayEvents[i]}
            />
          ))}
        </div>
        <div
          className={styles.daysWrapper}
          ref={(element) => {
            if (!element || this.alreadyScrolled) {
              return;
            }
            this.alreadyScrolled = true;
            element.scrollTop = HOUR_IN_PIXELS * 6.5;
          }}
        >
          <div className={styles.lines}>
            {this.renderLines()}
          </div>
          <div
            className={styles.days}
          >
            <Ruler timeConvention={timeConvention} />
            {week.days.map((day, i) => (
              <Day
                availableWidth={(availableWidth - RULER_WIDTH_IN_PIXELS) / 7}
                timeConvention={timeConvention}
                index={i}
                key={day.date}
                date={day.date}
                events={dayEvents[i]}
                initialSelections={daySelections[i]}
                onChange={this.handleDayChange}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }
}

Week.propTypes = {
  availableWidth: PropTypes.number.isRequired,
  timeConvention: PropTypes.oneOf(['12h', '24h']),
  events: PropTypes.arrayOf(PropTypes.shape({
    start: PropTypes.instanceOf(Date),
    end: PropTypes.instanceOf(Date),
    title: PropTypes.string,
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

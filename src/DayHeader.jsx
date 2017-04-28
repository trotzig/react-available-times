import PropTypes from 'prop-types';
import React, { Component } from 'react';

import day from './Day';
import styles from './DayHeader.css';

export default class DayHeader extends Component {
  text() {
    const { day, availableWidth } = this.props;
    const dateNumber = day.date.getDate();

    if (availableWidth < 55) {
      return (
        <span>
          {day.abbreviated}
          <br/>
          {dateNumber}
        </span>
      );
    }

    if (availableWidth < 90) {
      return `${day.abbreviated} ${dateNumber}`;
    }

    return `${day.name} ${dateNumber}`;
  }

  render() {
    const {
      day,
      availableWidth,
      events,
    } = this.props;

    return (
      <div
        className={styles.component}
      >
        <div className={styles.day}>
          {this.text()}
        </div>
        <div className={styles.events}>
          {events.filter(({ allDay }) => allDay).map((event, i) => (
            <div
              key={i + event.title}
              className={styles.event}
              style={{
                color: event.foregroundColor,
                backgroundColor: event.backgroundColor,
              }}
              title={event.title}
            >
              {event.title}
            </div>
          ))}
        </div>
      </div>
    )
  }
}

DayHeader.propTypes = {
  day: PropTypes.object,
  availableWidth: PropTypes.number,
  events: PropTypes.arrayOf(PropTypes.object),
};

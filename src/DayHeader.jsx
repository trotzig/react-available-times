import PropTypes from 'prop-types';
import React, { Component } from 'react';

import styles from './DayHeader.css';

export default class DayHeader extends Component {
  text() {
    const { day, availableWidth } = this.props;
    const dateNumber = day.date.getDate();
    if (availableWidth < 55) {
      return (
        <span>
          {day.abbreviated}
          <br />
          {dateNumber}
        </span>
      );
    }

    return `${day.abbreviated} ${dateNumber}`;
  }

  dateLessText() {
    const { day, availableWidth } = this.props;

    if (availableWidth < 55) {
      return day.abbreviated;
    }

    return day.name;
  }

  render() {
    const {
      availableWidth,
      events,
      hideDates,
    } = this.props;
    const classes = [styles.day];

    if (!this.props.available) {
      classes.push(styles.transparent);
    }

    return (
      <div
        className={styles.component}
        style={{
          width: availableWidth,
        }}
      >
        <div className={classes.join(' ')}>
          {!hideDates && this.text()}
          {hideDates && this.dateLessText()}
        </div>
        <div className={styles.events}>
          {events.filter(({ allDay }) => allDay).map((event, i) => (
            <div
              // eslint-disable-next-line react/no-array-index-key
              key={i + event.title}
              className={styles.event}
              title={event.title}
            >
              {event.title}
            </div>
          ))}
        </div>
      </div>
    );
  }
}

DayHeader.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  day: PropTypes.object,
  availableWidth: PropTypes.number,
  events: PropTypes.arrayOf(PropTypes.object),
  hideDates: PropTypes.bool,
  available: PropTypes.bool,
};

import PropTypes from 'prop-types';
import React, { Component } from 'react';
import withAvailableWidth from 'react-with-available-width';

import day from './Day';
import styles from './DayHeader.css';

class DayHeader extends Component {
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
    } = this.props;

    return (
      <div
        className={styles.component}
      >
        {this.text()}
      </div>
    )
  }
}

DayHeader.propTypes = {
  day: PropTypes.object,
  availableWidth: PropTypes.number,
};

export default withAvailableWidth(DayHeader);

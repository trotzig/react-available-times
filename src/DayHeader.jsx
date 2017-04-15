import PropTypes from 'prop-types';
import React, { Component } from 'react';
import withAvailableWidth from 'react-with-available-width';

import day from './Day';
import styles from './DayHeader.css';

class DayHeader extends Component {
  render() {
    const {
      day,
      availableWidth,
    } = this.props;

    return (
      <div
        className={styles.component}
      >
        {availableWidth > 40 && day.name}
        {availableWidth < 40 && day.abbreviated}
      </div>
    )
  }
}

DayHeader.propTypes = {
  day: PropTypes.instanceOf(Date),
  availableWidth: PropTypes.number,
};

export default withAvailableWidth(DayHeader);

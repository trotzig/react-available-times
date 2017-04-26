import PropTypes from 'prop-types';
import React, { Component } from 'react';

import { HOUR_IN_PIXELS, RULER_WIDTH_IN_PIXELS } from './Constants';
import hours from './hours';
import styles from './Ruler.css';

export default class Ruler extends Component {
  render() {
    return (
      <div
        className={styles.component}
        style={{ width: RULER_WIDTH_IN_PIXELS }}
      >
        {hours(this.props.timeConvention).map((hour) => (
          <div
            key={hour}
            className={styles.hour}
            style={{ height: HOUR_IN_PIXELS }}
          >
            {hour}
          </div>
        ))}
      </div>
    );
  }
}
Ruler.propTypes = {
  timeConvention: PropTypes.oneOf(['12h', '24h']),
};

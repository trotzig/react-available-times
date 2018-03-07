import PropTypes from 'prop-types';
import React from 'react';

import { HOUR_IN_PIXELS, RULER_WIDTH_IN_PIXELS } from './Constants';
import hours from './hours';
import styles from './Ruler.css';

export default function Ruler({ timeConvention }) {
  return (
    <div
      className={styles.component}
      style={{ width: RULER_WIDTH_IN_PIXELS }}
    >
      {hours(timeConvention).map(hour => (
        <div
          key={hour}
          className={styles.hour}
          style={{ height: HOUR_IN_PIXELS }}
        >
          <div className={styles.inner}>
            {hour > 0 ? hour : null}
          </div>
        </div>
      ))}
    </div>
  );
}
Ruler.propTypes = {
  timeConvention: PropTypes.oneOf(['12h', '24h']),
};

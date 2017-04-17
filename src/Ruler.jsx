import React, { Component } from 'react';

import { HOUR_IN_PIXELS } from './Constants';
import hours from './hours';
import styles from './Ruler.css';

export default class Ruler extends Component {
  render() {
    return (
      <div className={styles.component}>
        {hours.map((hour) => (
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

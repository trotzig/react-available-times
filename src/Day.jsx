import React, { Component } from 'react';

import hours from './hours';
import styles from './Day.css';

export default class Day extends Component {
  render() {
    return (
      <div className={styles.component}>
        {hours.map((hour) => (
          <div
            key={hour}
            className={styles.hour}
          >
            <div className={styles.halfHour}/>
          </div>
        ))}
      </div>
    );
  }
}

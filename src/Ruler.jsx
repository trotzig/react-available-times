import React, { Component } from 'react';

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
          >
            {hour}
          </div>
        ))}
      </div>
    );
  }
}

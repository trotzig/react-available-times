import React, { Component } from 'react';

import Day from './Day';
import Ruler from './Ruler';
import styles from './AvailableTimes.css';

export default class AvailableTimes extends Component {
  render() {
    return (
      <div className={styles.component}>
        <Ruler />
        <Day />
        <Day />
        <Day />
        <Day />
        <Day />
        <Day />
        <Day />
      </div>
    );
  }
}

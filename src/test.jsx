import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import AvailableTimes from './AvailableTimes.jsx';
import styles from './test.css';

import './reset.css';

class Test extends Component {
  render() {
    return (
      <div className={styles.component}>
        <div className={styles.intro}>
          <h1>Example #1</h1>
          <p>
            Uses the current date as the starting point.
          </p>
        </div>
        <AvailableTimes />
      </div>
    );
  }
}
ReactDOM.render(<Test/>, document.getElementById('root'));

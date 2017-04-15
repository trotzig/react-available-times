import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import AvailableTimes from './AvailableTimes.jsx';
import styles from './reset.css';

class Test extends Component {
  render() {
    return (
      <div className={styles.component}>
        <AvailableTimes />
      </div>
    );
  }
}
ReactDOM.render(<Test/>, document.getElementById('root'));

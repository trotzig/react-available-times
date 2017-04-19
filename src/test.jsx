import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import AvailableTimes from './AvailableTimes.jsx';
import styles from './test.css';

import './reset.css';

function dateAt(dayInWeek, hours, minutes) {
  const date = new Date();
  while (date.getDay() > 0) {
    // reset to sunday
    date.setDate(date.getDate() - 1);
  }
  for (let i = 0; i < dayInWeek; i++) {
    date.setDate(date.getDate() + 1);
  }
  date.setHours(hours, minutes, 0, 0);
  return date;
}

const events = [
  {
    start: dateAt(0, 12, 30),
    end: dateAt(0, 14, 0),
    label: 'Lunch with Lo',
  },
  {
    start: dateAt(1, 8, 5),
    end: dateAt(1, 10, 0),
    label: 'Breakfast club',
    color: '#f0f5f5',
  },
  {
    start: dateAt(1, 8, 20),
    end: dateAt(1, 10, 30),
    label: 'Morning meeting',
  },
  {
    start: dateAt(1, 10, 0),
    end: dateAt(1, 12, 0),
    label: 'Busy-time',
  },
  {
    start: dateAt(3, 8, 0),
    end: dateAt(3, 17, 0),
    label: 'Conference',
  },
  {
    start: dateAt(4, 17, 0),
    end: dateAt(4, 19, 0),
    label: 'Pick up groceries',
  },
  {
    start: dateAt(5, 10, 0),
    end: dateAt(5, 13, 20),
    label: 'Prepare presentation',
    color: '#f0f0f0',
  },
  {
    start: dateAt(5, 11, 0),
    end: dateAt(5, 12, 20),
    label: 'Remember to sign papers',
  },
  {
    start: dateAt(5, 12, 0),
    end: dateAt(5, 14, 0),
    label: 'Taxi to airport',
    color: '#f5f0f0',
  },
  {
    start: dateAt(5, 13, 30),
    end: dateAt(5, 19, 25),
    label: 'Flight to Chicago',
  },
];


class Test extends Component {
  constructor() {
    super();
    this.state = {
      selections: [],
      filteredEvents: events,
    };
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(selections) {
    this.setState({ selections });
  }

  render() {
    const { selections } = this.state;

    return (
      <div>
        <div className={styles.example}>
          <div className={styles.intro}>
            <h1>Example #1</h1>
            <p>
              Uses the current date as the starting point.
            </p>
            <label>
              <input
                type="checkbox"
                initialChecked
                onChange={(e) => {
                  if (e.target.checked) {
                    this.setState({ filteredEvents: events.filter((e) => e.color) })
                  } else {
                    this.setState({ filteredEvents: events })
                  }
                }}
              />
              Hide some events
            </label>
            {selections.length > 0 && (
              <div>
                <h2>Selected ({selections.length})</h2>
                <ul className={styles.selected}>
                  {selections.map(({ start, end }) => (
                    <li key={start}>
                      {start.toString()} - {end.toString()}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          <AvailableTimes
            events={this.state.filteredEvents}
            around={new Date()}
            onChange={this.handleChange}
          />
        </div>
      </div>
    );
  }
}
ReactDOM.render(<Test/>, document.getElementById('root'));

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

const calendars = [
  {
    id: 'private',
    displayName: 'Private',
    backgroundColor: '#666',
    foregroundColor: '#fff',
  },
  {
    id: 'work',
    displayName: 'Work',
    backgroundColor: 'pink',
    foregroundColor: 'black',
  },
];

const events = [
  {
    start: dateAt(0, 12, 30),
    end: dateAt(0, 14, 0),
    label: 'Lunch with Lo',
    calendar: 'private',
  },
  {
    start: dateAt(1, 8, 5),
    end: dateAt(1, 10, 0),
    label: 'Breakfast club',
    calendar: 'work',
  },
  {
    start: dateAt(1, 20, 0),
    end: dateAt(2, 10, 0),
    label: 'Night club',
    calendar: 'private',
  },
  {
    start: dateAt(1, 8, 20),
    end: dateAt(1, 10, 30),
    label: 'Morning meeting',
    calendar: 'private',
  },
  {
    start: dateAt(1, 10, 0),
    end: dateAt(1, 12, 0),
    label: 'Busy-time',
    calendar: 'private',
  },
  {
    start: dateAt(3, 8, 0),
    end: dateAt(3, 17, 0),
    label: 'Conference',
    calendar: 'private',
  },
  {
    start: dateAt(4, 17, 0),
    end: dateAt(4, 19, 0),
    label: 'Pick up groceries',
    calendar: 'private',
  },
  {
    start: dateAt(5, 10, 0),
    end: dateAt(5, 13, 20),
    label: 'Prepare presentation',
    calendar: 'work',
  },
  {
    start: dateAt(5, 11, 0),
    end: dateAt(5, 12, 20),
    label: 'Remember to sign papers',
    calendar: 'private',
  },
  {
    start: dateAt(5, 12, 0),
    end: dateAt(5, 14, 0),
    label: 'Taxi to airport',
    calendar: 'work',
  },
  {
    start: dateAt(5, 13, 30),
    end: dateAt(5, 19, 25),
    label: 'Flight to Chicago',
    calendar: 'private',
  },
];

const initialSelections = [
  {
    start: dateAt(1, 12, 5),
    end: dateAt(1, 14, 0),
  },
  {
    start: dateAt(4, 11, 0),
    end: dateAt(4, 12, 30),
  },
];


class Test extends Component {
  constructor() {
    super();
    this.state = {
      selections: initialSelections,
    };
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(selections) {
    this.setState({ selections });
  }

  render() {
    const { selections } = this.state;

    const fullscreen = window.location.search === '?fullscreen';
    return (
      <div>
        <div className={styles.example}>
          {!fullscreen &&
            <div className={styles.intro}>
              <h1>Example #1</h1>
              <p>
                Uses the current date as the starting point.
              </p>
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
              <a href="/?fullscreen">
                Go full screen
              </a>
            </div>
          }
          <AvailableTimes
            height={fullscreen ? undefined : 600}
            events={events}
            calendars={calendars}
            initialVisibleCalendars={['private', 'work']}
            start={new Date()}
            onChange={this.handleChange}
            initialSelections={initialSelections}
          />
        </div>
      </div>
    );
  }
}
ReactDOM.render(<Test/>, document.getElementById('root'));

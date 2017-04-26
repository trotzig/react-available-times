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
    title: 'Private',
    backgroundColor: '#666',
    foregroundColor: '#fff',
    selected: true,
  },
  {
    id: 'work',
    title: 'Work',
    backgroundColor: 'pink',
    foregroundColor: 'black',
    selected: true,
  },
];

const initialSelections = [
  {
    start: dateAt(1, 12, 0),
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
    this.handleEventsRequested = this.handleEventsRequested.bind(this);
  }

  handleChange(selections) {
    this.setState({ selections });
  }

  handleEventsRequested({ start, end, calendarId, callback }) {
    console.log(calendarId, start, end);
    callback([
      {
        start: new Date(start.getTime() + 12 * 60 * 60 * 1000),
        end: new Date(start.getTime() + 14 * 60 * 60 * 1000),
        title: 'Lunch with Lo',
        calendarId,
      },
      {
        start: new Date(start.getTime() + 36 * 60 * 60 * 1000),
        end: new Date(start.getTime() + 38 * 60 * 60 * 1000),
        title: 'Breakfast club',
        calendarId,
      },
      {
        start: new Date(start.getTime() + 77 * 60 * 60 * 1000),
        end: new Date(start.getTime() + 78 * 60 * 60 * 1000),
        title: 'Something different',
        calendarId,
      },
      {
        start: new Date(end.getTime() - 12 * 60 * 60 * 1000),
        end: new Date(end.getTime() - 11 * 60 * 60 * 1000),
        title: 'Weekend stuff',
        calendarId,
      },
    ]);
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
            timeConvention="12h"
            height={fullscreen ? undefined : 600}
            calendars={calendars}
            start={new Date()}
            onChange={this.handleChange}
            initialSelections={initialSelections}
            onEventsRequested={this.handleEventsRequested}
          />
        </div>
      </div>
    );
  }
}
ReactDOM.render(<Test/>, document.getElementById('root'));

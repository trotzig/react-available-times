import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import momentTimezone from 'moment-timezone';

import AvailableTimes from './AvailableTimes';
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

const TIME_ZONE = 'America/Los_Angeles';

const calendars = [
  {
    id: 'private',
    title: 'My own private calendar with plenty of stuff in it',
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
    start: dateAt(1, 12, 15),
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

  // eslint-disable-next-line class-methods-use-this
  handleEventsRequested({ start: s, end: e, calendarId, callback }) {
    // eslint-disable-next-line no-console
    console.log(calendarId, s, e);
    const events = [];
    const date = momentTimezone.tz(s, TIME_ZONE);

    while (date.toDate() < e) {
      const start = date.toDate();
      const end = date.add(Math.round(Math.random() * 4), 'hour').toDate();
      if (Math.random() > 0.98) {
        const startM = momentTimezone.tz(start, TIME_ZONE);
        const startString = startM.format('YYYY-MM-DD');
        events.push({
          start: startString,
          end: startM.date(startM.date() + 1).format('YYYY-MM-DD'),
          title: `All day ${calendarId}`,
          allDay: true,
          calendarId,
        });
      }
      if (Math.random() > 0.7) {
        events.push({
          start: start.toISOString(),
          end: end.toISOString(),
          title: `Event ${calendarId}`,
          calendarId,
        });
      }
    }
    const latency = Math.random() * 5000;
    // eslint-disable-next-line no-console
    console.log(`Simulated latency for ${calendarId}`, latency);
    setTimeout(() => {
      callback(events);
    }, latency);
  }

  render() {
    const { selections, recurring } = this.state;

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
              <br />
              <br />
              <button onClick={() => this.setState({ recurring: true })}>
                Switch to recurring
              </button>
              <br />
              <br />
              <button onClick={() => this.setState({ recurring: false })}>
                Switch to time specific
              </button>
            </div>
          }
          <div className={styles.main}>
            <AvailableTimes
              timeConvention="24h"
              timeZone={TIME_ZONE}
              height={fullscreen ? undefined : 600}
              calendars={calendars}
              weekStartsOn="monday"
              start={new Date()}
              onChange={this.handleChange}
              initialSelections={initialSelections}
              onEventsRequested={this.handleEventsRequested}
              recurring={recurring}
            />
          </div>
        </div>
      </div>
    );
  }
}
ReactDOM.render(<Test />, document.getElementById('root'));

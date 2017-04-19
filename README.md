# React Available Times

A React component that allows a user to select time-slots in a calendar-like UI.

## Installation
```
npm install --save react-available-times
```

## Usage

```jsx
import AvailableTimes from 'react-available-times';

<AvailableTimes
  onChange={(selections) => {
    selections.forEach(({ start, end }) => {
      console.log('Start:', start, 'End:', end);
    })
  }}
  initialSelections={[
    { start: aDateObject, end: anotherDateObject }
  ]}
  events={[
    { start: aDateObject, end: anotherDateObject },
    { start: aDateObject, end: anotherDateObject }
  ]}
  around={new Date()}
  height={400}
/>
```

## Props

None of the props are required.

- `onChange`: a function called whenever a selection is made. Receives an array
  of objects, each with a `start` and an `end` date.
- `initialSelections`: an array of pre-filled selections. Each object in the
  array needs a `start` and an `end` date.
- `events`: calendar events, usually pulled from a different source (e.g. a
  Google Calendar). Each object needs a `start` and an `end` date, plus a
  `label` property. Optionally, they can also have a `color`.
- `around`: a date signalling the week you want to display. Can be any day
  within the week.
- `height`: a string or a number controlling the `height` of the component.
  E.g. `'100%'`, `350`, `'100vh'`. If left out, the full height of the screen
  will be used.

## Contributing

First, run `npm install` to install all dependencies  Then, to manually test
the component, run `npm run build-test -- --watch` and open `src/test.html` in
a browser.

Unit tests are run with [jest](https://facebook.github.io/jest/). Run `npm run
test -- --watch` to run through tests.

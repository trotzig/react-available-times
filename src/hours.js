import zeroPad from './zeroPad';

const hours = [];
for (let i = 0; i < 24; i++) {
  hours.push(zeroPad(i));
}

export default hours;

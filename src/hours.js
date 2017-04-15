const hours = [];
for (let i = 0; i < 24; i++) {
  if (i < 10) {
    hours.push(`0${i}`);
  } else {
    hours.push(`${i}`);
  }
}

export default hours;

import moment from 'moment';

function formatTime(date, timeConvention) {
  if (timeConvention === '12h') {
    return moment(date).format('ha');
  }
  return moment(date).format('HH');
}

export default function hours(timeConvention) {
  const result = [];
  const date = new Date();
  for (let i = 0; i < 24; i++) {
    date.setHours(i, 0, 0, 0);
    result.push(formatTime(date, timeConvention));
  }
  return result;
}

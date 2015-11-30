import { generateData, titleize } from '../support/utils';
import moment from 'moment';

function template(id) {
  // All events start at a random time between 7am and 12pm
  const startHour = faker.random.number({min: 7, max: 12});
  const startsAt = moment(faker.date.recent(-30)).hour(startHour).minute(0).second(0);

  // All are up to 8 hours long so they don't go past midnight
  const hourSpan = faker.random.number({min: 2, max: 8});
  const endsAt = moment(startsAt).add(hourSpan, 'hours').add(20, 'days');

  let repeats, daysOfWeek, weeksOfMonth;

  if (id % 2 === 0) {
    repeats = 'weekly';
    daysOfWeek = [1,4];
  } else if (id % 3 === 0) {
    repeats = 'bi-weekly';
    daysOfWeek = [2,5];
  } else if (id % 5 === 0) {
    repeats = 'monthly';
    daysOfWeek = [startsAt.day()+1];
    weeksOfMonth = [Math.ceil(startsAt.date()/7)-1];
  } else {
    repeats = 'daily';
    daysOfWeek = [];
  }

  return {
    id: id,
    event_id: faker.random.number(100),
    subtitle: titleize(faker.lorem.sentences(1)),
    starts_at: startsAt.toISOString(),
    ends_at: endsAt.toISOString(),
    repeats: repeats,
    days_of_week: daysOfWeek,
    weeks_of_month: weeksOfMonth
  };
}

export default generateData(10, template);

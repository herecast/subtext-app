import moment from 'moment';

function titleize(words) {
  return words.split(' ').map((word) => {
    return word.capitalize();
  }).join(' ');
}

function generateEvent(id) {
  // All events start at a random time between 7am and 12pm
  const startHour = faker.random.number({min: 7, max: 12});
  const startsAt = moment(faker.date.recent(-30)).hour(startHour).minute(0).second(0);

  // All are up to 8 hours long so they don't go past midnight
  const hourSpan = faker.random.number({min: 2, max: 8});
  const endsAt = moment(startsAt).add(hourSpan, 'hours');

  return {
    id: id,
    subtitle: titleize(faker.lorem.sentences(1)),
    starts_at: startsAt.toISOString(),
    ends_at: endsAt.toISOString()
  };
}

function allInstances() {
  const events = [];

  for (let i = 1; i < 4; i += 1) {
    events.push(generateEvent(i));
  }

  return events;
}

export default allInstances();

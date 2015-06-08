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
    admin_content_url: `http://${faker.internet.domainName()}`,
    event_id: faker.random.number(100),
    can_edit: true,
    title: titleize(faker.lorem.sentences(1)),
    subtitle: titleize(faker.lorem.sentences(1)),
    content: `<p>${faker.lorem.paragraph(5)}</p>`,
    content_id: faker.random.number(1000),
    cost_type: 'paid', // free, paid, donation
    cost: '$15-$55',
    contact_phone: faker.phone.phoneNumber(),
    contact_email: faker.internet.email(),
    event_url: `http://${faker.internet.domainName()}`,
    venue_id: faker.random.number(1000),
    venue_name: titleize(faker.lorem.words(3).join(' ')),
    venue_address: faker.address.streetAddress(),
    venue_city: faker.address.city(),
    venue_state: 'VT',
    venue_zip: faker.address.zipCode(),
    venue_url: `http://${faker.internet.domainName()}`,
    venue_latitude: '44.4758',
    venue_longitude: '-73.2119',
    venue_locate_name: titleize(faker.lorem.sentences(1)),
    starts_at: startsAt.toISOString(),
    ends_at: endsAt.toISOString()
  };
}

function allInstances() {
  const events = [];

  for (let i = 1; i < 100; i += 1) {
    events.push(generateEvent(i));
  }

  return events;
}

export default allInstances();

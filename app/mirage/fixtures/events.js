import faker from 'faker';
import moment from 'moment';

function titleize(words) {
  return words.split(' ').map((word) => {
    return word.capitalize();
  }).join(' ');
}

function generateEvent(id) {
  const startsAt = moment(faker.date.recent(-30)).hour(9).minute(0).second(0);
  const endsAt = moment(startsAt).add(8, 'hours');

  return {
    id: id,
    title: titleize(faker.lorem.sentences(1)),
    subtitle: titleize(faker.lorem.sentences(1)),
    description: faker.lorem.paragraph(5),
    ticket_type: 'paid', // free, paid, donation
    cost: '$15-$55',
    contact_name: faker.name.findName(),
    contact_phone: faker.phone.phoneNumber(),
    contact_email: faker.internet.email(),
    url: `http://${faker.internet.domainName()}`,
    venue_name: titleize(faker.lorem.words(3).join(' ')),
    address1: faker.address.streetAddress(),

    // this is not in the schema, not sure if we need it
    address2: faker.address.secondaryAddress(),

    city: faker.address.city(),
    state: 'VT',
    zip: faker.address.zipCode(),
    starts_at: startsAt.toISOString(),
    ends_at: endsAt.toISOString(),
    photo_url_small: faker.image.imageUrl(),
    other_dates: [
      {
        starts_at: moment(faker.date.recent(-10)).toISOString(),
        ends_at: moment(faker.date.recent(-10)).toISOString()
      },
      {
        starts_at: moment(faker.date.recent(-10)).toISOString(),
        ends_at: moment(faker.date.recent(-10)).toISOString()
      }
    ]
  };
}

function allEvents() {
  const events = [];

  for (let i = 1; i < 50; i += 1) {
    events.push(generateEvent(i));
  }

  return events;
}

export default allEvents();

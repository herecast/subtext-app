import { generateData, titleize } from '../support/utils';
import moment from 'moment';

function template(id) {
  // All events start at a random time between 7am and 12pm
  const startHour = faker.random.number({min: 7, max: 12});
  const startsAt = moment(faker.date.recent(-30)).hour(startHour).minute(0).second(0);

  // All are up to 8 hours long so they don't go past midnight
  const hourSpan = faker.random.number({min: 2, max: 8});
  const endsAt = moment(startsAt).add(hourSpan, 'hours');

  // Only a subset of the events will have an image.
  const imageUrl = (id % 2 === 0) ? 'https://placeholdit.imgix.net/~text?txtsize=33&txt=Event&w=500&h=500' : null;

  // Only a subset of the events will have a venue name.
  const venueName = (id % 3 === 0) ? titleize(faker.lorem.words(3).join(' ')) : null;

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
    venue_name: venueName,
    venue_address: faker.address.streetAddress(),
    venue_city: faker.address.city(),
    venue_state: 'VT',
    venue_zip: faker.address.zipCode(),
    venue_url: `http://${faker.internet.domainName()}`,
    venue_latitude: '44.4758',
    venue_longitude: '-73.2119',
    venue_locate_name: titleize(faker.lorem.sentences(1)),
    starts_at: startsAt.toISOString(),
    ends_at: endsAt.toISOString(),
    image_url: imageUrl
  };
}

export default generateData(100, template);

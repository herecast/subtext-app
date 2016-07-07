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
  const venueName = (id % 3 === 0) ? titleize(faker.lorem.words(3)) : null;

  const deadline = (id % 4 === 0) ? startsAt : null;

  return {
    id: id,
    adminContentUrl: `http://${faker.internet.domainName()}`,
    eventId: faker.random.number(100),
    canEdit: true,
    title: titleize(faker.lorem.sentences(1)),
    subtitle: titleize(faker.lorem.sentences(1)),
    commentCount: faker.random.number(8),
    content: `<p>${faker.lorem.paragraph(5)}</p>`,
    contentId: faker.random.number(1000),
    costType: 'paid', // free, paid, donation
    cost: '$15-$55',
    contactPhone: faker.phone.phoneNumber(),
    contactEmail: faker.internet.email(),
    eventUrl: `http://${faker.internet.domainName()}`,
    venueId: faker.random.number(1000),
    venueName: venueName,
    venueAddress: faker.address.streetAddress(),
    venueCity: faker.address.city(),
    venueState: 'VT',
    venueZip: faker.address.zipCode(),
    venueUrl: `http://${faker.internet.domainName()}`,
    venueLatitude: '44.4758',
    venueLongitude: '-73.2119',
    venueLocateName: titleize(faker.lorem.sentences(1)),
    registrationDeadline: deadline,
    registrationUrl: `http://${faker.internet.domainName()}`,
    registrationPhone: faker.phone.phoneNumber(),
    registrationEmail: faker.internet.email(),
    startsAt: startsAt.toISOString(),
    endsAt: endsAt.toISOString(),
    imageUrl: imageUrl
  };
}

export default generateData(100, template);

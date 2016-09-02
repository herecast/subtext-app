import moment from 'moment';

function titleize(words) {
  return words.split(' ').map((word) => {
    return word.capitalize();
  }).join(' ');
}

function imageUrl(id) {
  return (id % 2 === 0) ? 'https://placeholdit.imgix.net/~text?txtsize=33&txt=Event&w=500&h=500' : null;
}

function startsAt() {
    const startHour = faker.random.number({min: 7, max: 12});
    return moment(faker.date.recent(-30)).hour(startHour).minute(0).second(0);
}

function generateEvent(id) {
  return {
    id: id,
    title: titleize(faker.lorem.sentences(1)),
    subtitle: titleize(faker.lorem.sentences(1)),
    content: `<p>${faker.lorem.paragraph(5)}</p>`,
    contentId: faker.random.number(1000),
    costType: 'paid', // free, paid, donation
    cost: '$15-$55',
    contactPhone: faker.phone.phoneNumber(),
    contactEmail: faker.internet.email(),
    eventUrl: `http://${faker.internet.domainName()}`,
    imageUrl: imageUrl(id),
    startsAt: startsAt(),
    venueId: faker.random.number(1000),
    venueName: titleize(faker.lorem.words(3)),
    venueAddress: faker.address.streetAddress(),
    venueCity: faker.address.city(),
    venueState: 'VT',
    venueZip: faker.address.zipCode(),
    venueUrl: `http://${faker.internet.domainName()}`,
    venueLatitude: faker.address.latitude(),
    venueLongitude: faker.address.longitude(),
    venueLocateName: titleize(faker.lorem.sentences(1))
  };
}

function allEvents() {
  const events = [];

  for (let i = 1; i < 100; i += 1) {
    events.push(generateEvent(i));
  }

  return events;
}

export default allEvents();

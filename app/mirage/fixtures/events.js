function titleize(words) {
  return words.split(' ').map((word) => {
    return word.capitalize();
  }).join(' ');
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
    venueId: faker.random.number(1000),
    venueName: titleize(faker.lorem.words(3).join(' ')),
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

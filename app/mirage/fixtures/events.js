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
    venue_zipcode: faker.address.zipCode(),
    venue_url: `http://${faker.internet.domainName()}`,
    venue_latitude: faker.address.latitude(),
    venue_longitude: faker.address.longitude(),
    venue_locate_name: titleize(faker.lorem.sentences(1)),
    image_url: 'http://placehold.it/800x600'
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

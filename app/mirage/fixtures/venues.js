function titleize(words) {
  return words.split(' ').map((word) => {
    return word.capitalize();
  }).join(' ');
}

function generateVenue(id) {
  return {
    id: id,
    name: titleize(faker.lorem.words(3)),
    address: faker.address.streetAddress(),
    city: faker.address.city(),
    state: 'VT',
    url: `http://${faker.internet.domainName()}`,
    zip: faker.address.zipCode()
  };
}

function allVenues() {
  const venues = [];

  for (let i = 1; i < 5; i += 1) {
    venues.push(generateVenue(i));
  }

  return venues;
}

export default allVenues();

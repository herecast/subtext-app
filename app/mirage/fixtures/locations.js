function generateLocation(id) {
  return {
    id: id,
    city: faker.address.city(),
    state: 'VT'
  };
}

function allLocations() {
  const locations = [];

  for (let i = 1; i < 8; i += 1) {
    locations.push(generateLocation(i));
  }

  return locations;
}

export default allLocations();

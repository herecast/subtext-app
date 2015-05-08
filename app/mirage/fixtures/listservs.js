function generateListserv(id) {
  return {
    id: id,
    name: `${faker.address.city()} Listserv`
  };
}

function allListservs() {
  const listservs = [];

  for (let i = 1; i < 15; i += 1) {
    listservs.push(generateListserv(i));
  }

  return listservs;
}

export default allListservs();

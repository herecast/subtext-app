import moment from 'moment';

function allCurrentUsers() {
  const createdAt = moment(faker.date.recent(-30));
  return [{
    id: 1,
    name: faker.name.findName(),
    email: "embertest@subtext.org",
    created_at: createdAt.toISOString(),
    image_url: 'https://placeholdit.imgix.net/~text?txtsize=18&txt=Avatar&w=200&h=200',
    location: 'Norwich, VT',
    test_group: 'Consumer',
    listserv_id: 1,
    listserv_name: 'Norwich Listserv'
  }];
}


export default allCurrentUsers();

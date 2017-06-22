import Mirage, {faker} from 'ember-cli-mirage';
import moment from 'moment';

export default Mirage.Factory.extend({
  id: 1,
  name() { return faker.name.findName(); },
  email: "embertest@subtext.org",
  createdAt() { return moment(faker.date.recent(-30)).toISOString(); },
  imageUrl() {
    return (Math.random() > 0.5) ? 'https://placeholdit.imgix.net/~text?txtsize=18&txt=Avatar&w=200&h=200' : null;
  },
  testGroup: 'Consumer',
  listservId: 1,
  listservName: 'Norwich Listserv',
  //managedOrganizationIds() { return [1, 2, 3]; },
  canPublishNews: true,

  afterCreate(user, server) {
    if(!user.locationId) {
      const location = server.create('location');
      user.location = location.city + ', ' + location.state;
      user.locationId = location.id;
      user.save();
    }
  }
});

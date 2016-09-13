import Mirage, {faker} from 'ember-cli-mirage';
import moment from 'moment';

export default Mirage.Factory.extend({
  name() { return faker.name.findName(); },
  email() { return faker.internet.email(); },
  createdAt() { return moment(faker.date.recent(-30)).toISOString(); },
  imageUrl() {
    return (Math.random() > 0.5) ? 'https://placeholdit.imgix.net/~text?txtsize=18&txt=Avatar&w=200&h=200' : null;
  },
  location: 'Norwich, VT',
  locationId: 1,
  testGroup: 'Consumer',
  listservId: 1,
  listservName: 'Norwich Listserv',
  //managedOrganizationIds() { return [1, 2, 3]; },
  canPublishNews: true
});

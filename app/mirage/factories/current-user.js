import Mirage, {faker} from 'ember-cli-mirage';
import moment from 'moment';

export default Mirage.Factory.extend({
  id: 1,
  name() { return faker.name.findName(); },
  email: "embertest@subtext.org",
  created_at() { return moment(faker.date.recent(-30)).toISOString(); },
  image_url() {
    return (Math.random() > 0.5) ? 'https://placeholdit.imgix.net/~text?txtsize=18&txt=Avatar&w=200&h=200' : null;
  },
  location: 'Norwich, VT',
  location_id: 1,
  test_group: 'Consumer',
  listserv_id: 1,
  listserv_name: 'Norwich Listserv',
  managed_organization_ids() { return [1, 2, 3]; }
});

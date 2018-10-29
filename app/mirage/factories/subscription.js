import Mirage, { faker } from 'ember-cli-mirage';
import moment from 'moment';

export default Mirage.Factory.extend({
  email() { return faker.internet.email(); },
  name(id) { return `Listserv Subscription ${id}`; },
  listservId(id) { return id; },
  user: null,
  confirmedAt() { return moment(faker.date.recent(-30)).toISOString(); },
  createdAt() { return moment(faker.date.recent(-30)).toISOString(); },
  unsubscribedAt: null
});

import Mirage, {faker} from 'ember-cli-mirage';
import moment from 'moment';

export default Mirage.Factory.extend({
  subject() { return faker.lorem.sentence(); },
  body() { return faker.lorem.paragraph(); },
  senderEmail() { return 'embertest@subtext.org'; },
  senderName() { return faker.name.findName(); },
  verifiedAt() { return null; },
  liveDate() { return moment().add(2, 'd').toDate(); },
  channelType() { return faker.helpers.shuffle('market', 'event', 'talk'); },
});

import Mirage, {faker} from 'ember-cli-mirage';

export default Mirage.Factory.extend({
  name() { return faker.company.companyName(); },
  can_publish_news() { return faker.helpers.shuffle(true, false); }
});

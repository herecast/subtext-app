import Mirage, {faker} from 'ember-cli-mirage';

export default Mirage.Factory.extend({
  name() { return faker.company.companyName(); },
  logo() { return faker.image.avatar(); },
  backgroundImage() { return faker.image.business(); },
  description() { return faker.lorem.paragraph(); },
  canPublishNews() { return true; }
});

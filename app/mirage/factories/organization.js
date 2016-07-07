import Mirage, {faker} from 'ember-cli-mirage';

export default Mirage.Factory.extend({
  name() { return faker.company.companyName(); },
  profileTitle() { return faker.company.companyName(); },
  logoUrl() { return faker.image.avatar(); },
  subscribeUrl() { return 'http://example.org/subscribe'; },
  orgType() { return faker.random.arrayElement(["Business", "Blog"]); },
  backgroundImageUrl() { return faker.image.business(); },
  description() { return faker.lorem.paragraph(); },
  canPublishNews() { return true; },
  canEdit() { return true; },
  businessProfileId() { return 1; }
});

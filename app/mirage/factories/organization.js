import Mirage, {faker} from 'ember-cli-mirage';

export default Mirage.Factory.extend({
  name() { return faker.company.companyName(); },
  profileTitle() { return faker.company.companyName(); },
  avatarUrl() { return faker.image.avatar(); },
  logoUrl() { return 'https://placeholdit.imgix.net/~text?txtsize=33&txt=Company+Name&w=300&h=200'; },
  subscribeUrl() { return 'http://example.org/subscribe'; },
  orgType() { return faker.random.arrayElement(["Business", "Blog"]); },
  backgroundImageUrl() { return faker.image.business(); },
  description() { return faker.lorem.paragraph(); },
  canPublishNews() { return true; },
  canEdit() { return true; },
  businessProfileId() { return 1; }
});

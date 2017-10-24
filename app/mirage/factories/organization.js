import Mirage, {faker} from 'ember-cli-mirage';

export default Mirage.Factory.extend({
  name() { return faker.company.companyName(); },
  profileTitle() { return faker.company.companyName(); },
  profileImageUrl() { return faker.image.avatar(); },
  logoUrl() { return 'https://placeholdit.imgix.net/~text?txtsize=33&txt=Company+Logo&w=300&h=200'; },
  subscribeUrl() { return 'http://example.org/subscribe'; },
  orgType() { return faker.random.arrayElement(["Business", "Blog"]); },
  backgroundImageUrl() { return faker.image.business(); },
  description() { return faker.lorem.paragraph(); },
  canPublishNews() { return true; },
  canEdit() { return true; },
  businessProfileId() { return 1; },

  // Contact info: copied from business-profile factory to be consolidated
  phone() { return '8022951559'; },
  website() { return 'http://' + faker.internet.domainName(); },
  email() { return faker.internet.email(); },
  address() { return faker.address.streetAddress(); },
  hours: ["Mo-Fr|08:00-16:30","Sa|10:00-16:00"],
  city: "Norwich",
  state: 'VT',
  zip: '05055'
});

import Mirage, { faker } from 'ember-cli-mirage';

export default Mirage.Factory.extend({
  name() { return faker.company.companyName(); },
  profileImageUrl() {
    return faker.random.arrayElement([
      faker.image.avatar(),
      null
    ]);
  },
  claimed() { return faker.random.arrayElement([true, false]); },
  logoUrl() { return 'https://via.placeholder.com/300x200.png?text=300x200'; },
  orgType() { return faker.random.arrayElement(["Business", "Blog"]); },
  backgroundImageUrl() {
    return faker.random.arrayElement([
      faker.image.business(),
      null
    ]);
  },
  description() { return faker.lorem.paragraph(); },
  canPublishNews() { return true; },
  canEdit() { return true; },
  businessProfileId() { return 1; },

  activeSubscriberCount() { return faker.random.number(999); },
  postCount() { return faker.random.number(999); },
  totalViewCount() { return faker.random.number(9999999); },
  userHideCount() { return faker.random.number(999); },

  digestId() { return faker.random.arrayElement([1, null, null, null, null]); },
  certifiedStoryteller() { return faker.random.arrayElement([true, false, false, false, false]); },
  certifiedSocial() { return faker.random.arrayElement([true, false, false, false, false]); },
  services() { return faker.lorem.sentence(); },

  // Contact info: copied from business-profile factory to be consolidated
  phone() { return '8022951559'; },
  website() { return 'http://' + faker.internet.domainName(); },
  email() { return faker.internet.email(); },
  address() { return faker.address.streetAddress(); },
  hours() { return ["Mo-Fr|08:00-16:30","Sa|10:00-16:00"]; },
  city: "Norwich",
  state: 'VT',
  zip: '05055',
  bizFeedActive: true
});

import Mirage, {faker} from 'ember-cli-mirage';

export default Mirage.Factory.extend({
  name() { return faker.company.companyName(); },
  logo_url() { return faker.image.avatar(); },
  subscribe_url() { return 'http://example.org/subscribe'; },
  org_type() { return faker.random.array_element(["business", "blog"]); },
  background_image_url() { return faker.image.business(); },
  description() { return faker.lorem.paragraph(); },
  can_publish_news() { return true; },
  can_edit() { return true; },
  business_profile_id() { return 1; }
});

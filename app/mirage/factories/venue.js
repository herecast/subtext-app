import Mirage, { faker } from 'ember-cli-mirage';

export default Mirage.Factory.extend({
  name() { return faker.company.companyName(); },
  address() { return faker.address.streetAddress(); },
  city() { return faker.address.city(); },
  state: "VT",
  url() { return "http://" + faker.internet.domainName(); },
  zip() { return faker.address.zipCode(); }
});

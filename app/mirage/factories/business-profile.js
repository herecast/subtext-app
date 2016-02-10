import Mirage, {faker} from 'ember-cli-mirage';

export default Mirage.Factory.extend({
  organization_id: 0,
  name() { return faker.company.companyName(); },
  phone() { return faker.phone.phoneNumber(); },
  website() { return faker.internet.domainName(); },
  email() { return faker.internet.email(); },
  address() { return faker.address.streetAddress(); },
  hours: "Mon-Fri 8am-9am",
  city: "Norwich",
  state: 'VT',
  zip: '05055',
  lat() { return faker.address.latitude(); },
  lng() { return faker.address.longitude(); },
  service_radius: "12.5",
  logo() { return faker.image.avatar(); },
  images() { return [faker.image.business(),faker.image.business()]; },
  feedback: {
    metric1: "0.834",
    metric2: "0.675",
    metric3: "0.287",
    recommend: "0.687"
  },
  category_ids: []
});

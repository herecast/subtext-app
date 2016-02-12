import Mirage, {faker} from 'ember-cli-mirage';

export default Mirage.Factory.extend({
  organization_id: 0,
  name() { return faker.company.companyName(); },
  phone() { return faker.phone.phoneNumber(); },
  website() { return faker.internet.domainName(); },
  email() { return faker.internet.email(); },
  address() { return faker.address.streetAddress(); },
  hours: ["Mon-Fri 8am-9am","Sat 8:30pm - 8:35pm"],
  city: "Norwich",
  state: 'VT',
  zip: '05055',
  coords() {
    return {
      lat: faker.address.latitude(),
      lng: faker.address.longitude()
    };
  },
  service_radius: "12.5",
  details() { return faker.company.catchPhrase(); },
  logo() { return faker.image.avatar(); },
  images() { return [faker.image.business(),faker.image.business()]; },
  feedback: {
    satisfaction: "0.834",
    cleanliness: "0.675",
    price: "0.287",
    recommend: "0.687"
  },
  feedback_num: "10",
  views: "237",
  category_ids: [],
  biz_type() { return faker.helpers.shuffle('goes_to','comes_to'); }
});

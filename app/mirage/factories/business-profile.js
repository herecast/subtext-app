import Mirage, {faker} from 'ember-cli-mirage';

function generateLatLng(num) {
  return (Math.random() * (num - (num + 0.100)) + (num + 0.100)).toFixed(4);
}

export default Mirage.Factory.extend({
  name() { return faker.company.companyName(); },
  phone() { return '8022951559'; },
  website() { return 'http://' + faker.internet.domainName(); },
  email() { return faker.internet.email(); },
  address() { return faker.address.streetAddress(); },
  hours: ["Mo-Fr|08:00-16:30","Sa|10:00-16:00"],
  city: "Norwich",
  state: 'VT',
  zip: '05055',
  coords() {
    return {
      // generate coords within limited bounds
      lat: generateLatLng(40.000),
      lng: generateLatLng(-80.000)
    };
  },
  serviceRadius: "12.5",
  details() { return "<p>" + faker.lorem.sentences() + "</p>"; },
  logo() { return faker.image.avatar(); },
  images() { return [
    {primary: true, url: faker.image.business()},
    {primary: false, url: faker.image.business()}
  ]; },
  feedback() {
    return {
      satisfaction: Math.random(),
      cleanliness: Math.random(),
      price: Math.random(),
      recommend: Math.random()
    };
  },
  feedbackNum() { return Math.floor( Math.random() * 10 ); },
  views: "237",
  hasRetailLocation() { return faker.random.boolean(); },
  canEdit() { return faker.random.boolean(); },
  hasRated() { return faker.random.boolean(); },
  bizFeedActive: true,

  afterCreate(bizProfile, server) {
    bizProfile.organization = (
      bizProfile.organization || server.create('organization')
    );
  }
});

import {Factory, association, faker} from 'ember-cli-mirage';
import { titleize } from 'subtext-ui/mirage/support/utils';

function otherInstance() {
  return {
    ends_at: faker.date.future(),
    starts_at: faker.date.past(),
    id: faker.random.number(9999),
    presenter_name: faker.name.findName(),
    subtitle: faker.lorem.sentence(),
    title: faker.lorem.sentence()
  };
}

export default Factory.extend({
  title()    { return faker.lorem.sentence(); },
  subtitle() { return faker.lorem.sentence(); },
  contentType(id) {
    const contentTypes = ['news', 'event', 'market', 'talk'];
    const minOfEach = 4;

    if (id < contentTypes.length * minOfEach) {
      return contentTypes[id % minOfEach];
    }

    return faker.random.arrayElement(contentTypes);
  },
  contentOrigin() { return faker.random.arrayElement(['ugc', 'listserv']); },
  canEdit() { return faker.random.arrayElement([true, false]); },

  authorId() { return faker.random.number(9999); },
  authorName() { return faker.name.findName(); },
  avatarUrl() { return faker.image.avatar(); },

  viewCount() { return faker.random.number(999); },

  eventId() { return faker.random.number(9999); },
  eventInstances() {
    if(this.contentType === 'event') {
      let instancesArray = [];
      const iterations = 3;
      for (var i=0; i<iterations; i++) {
        instancesArray.push(otherInstance());
      }
      return instancesArray;
    } else {
      return [];
    }
  },
  eventInstanceId() {
    if(this.eventInstances.length) {
      return this.eventInstances[0].id;
    }
  },
  venueName(id) { return (id % 3 === 0) ? titleize(faker.lorem.words(3)) : null;},
  venueAddress() { return faker.address.streetAddress();},
  venueCity() { return faker.address.city();},
  venueState: 'VT',
  venueZip() { return faker.address.zipCode();},
  cost() { return faker.random.arrayElement(['Free', `$${faker.random.number(999)}`]); },
  startsAt() { return faker.date.future(); },
  endsAt() { return faker.date.future(); },

  contentLocations: [],

  publishedAt() { return faker.date.past(); },
  updatedAt() { return faker.date.past(); },

  organization: association(),

  organizationName() { return faker.company.companyName(); },
  organizationProfileImageUrl() { return faker.image.business(); },

  imageUrl: 'http://placeholdit.imgix.net/~text?txtsize=33&txt=400%C3%97240&w=400&h=240',
  images: [{
    id: 1,
    caption() { return faker.lorem.sentence(); },
    credit: null,
    image_url: "http://placeholdit.imgix.net/~text?txtsize=33&txt=400%C3%97240&w=400&h=240",
    primary: true,
    width: 266,
    height: 200
  },
  {
    id: 2,
    caption() { return faker.lorem.sentence(); },
    credit: null,
    image_url: "http://placeholdit.imgix.net/~text?txtsize=33&txt=400%C3%97240&w=400&h=240",
    primary: false,
    width: 266,
    height: 200
  }],

  price() { return `$${faker.random.number(999)} OBO`; },
  sold() { return faker.random.arrayElement([true, false]); }
});

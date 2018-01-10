import {Factory, association, faker} from 'ember-cli-mirage';
import moment from 'moment';

function generateSplitContent() {
  const head = '<p>' + faker.lorem.sentences() + '</p>';
  const tail = '<p>' + faker.lorem.paragraphs() + '</p>';

  return {head: head, tail: tail};
}

export default Factory.extend({
  afterCreate(feedContent, server) {
    if (feedContent.contentType === 'event' && !feedContent.eventInstances.length) {
      let newEndDate = moment(feedContent.startsAt).add(1, 'hours').toDate();

      feedContent.update({endsAt: newEndDate});

      const instances = server.createList('event-instance', 3, { event: feedContent.id });
      return instances.map(({id}) => id);
    }
  },

  title()    { return faker.company.catchPhrase(); },
  subtitle() { return faker.lorem.sentence(); },
  contentType(id) {
    const contentTypes = ['news', 'event', 'market', 'talk'];
    const minOfEach = 4;

    if (id < contentTypes.length * minOfEach) {
      return contentTypes[id % contentTypes.length];
    }

    return faker.random.arrayElement(contentTypes);
  },

  splitContent() { return generateSplitContent(); },
  content() { return this.splitContent.head + this.splitContent.tail; },
  embeddedAd() { return faker.random.arrayElement([true, false, false, false, false]); },
  contentOrigin() { return faker.random.arrayElement(['ugc', 'listserv']); },
  canEdit() { return faker.random.arrayElement([true, false]); },

  authorId() { return faker.random.number(9999); },
  authorName() { return faker.name.findName(); },
  avatarUrl() { return faker.image.avatar(); },

  viewCount() { return faker.random.number(999); },

  eventId() { return faker.random.number(9999); },
  eventInstances() {
    return [];
  },
  eventInstanceId() {
    if(this.eventInstances.length) {
      return this.eventInstances[0].id;
    }
  },
  venueName() { return faker.random.arrayElement(["Grannie's Garage", "Krusty Kastle", "Club Hee-Haw", "Chez Charli"]);},
  venueAddress() { return faker.address.streetAddress();},
  venueCity() { return faker.address.city();},
  venueState: 'VT',
  venueZip() { return faker.address.zipCode();},
  costType: 'paid', // free, paid, donation
  cost() { return faker.random.arrayElement(['Free', `$${faker.random.number(999)}`]); },
  startsAt() {
    let rangeStart = moment().add(1, 'days').toDate();
    let rangeEnd = moment(rangeStart).add(1, 'days').toDate();

    return faker.date.between(rangeStart, rangeEnd);
  },
  endsAt() {
    let rangeStart = moment().add(3, 'days').toDate();
    let rangeEnd = moment(rangeStart).add(1, 'days').toDate();

    return faker.date.between(rangeStart, rangeEnd);
  },
  contentLocations: [],

  publishedAt() { return faker.date.past(); },
  updatedAt() { return faker.date.past(); },

  bizFeedPublic() { return faker.random.arrayElement([true, false]); },

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

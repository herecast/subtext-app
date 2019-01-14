import { isBlank } from '@ember/utils';
import { get } from '@ember/object';
import { Factory, association, faker } from 'ember-cli-mirage';
import moment from 'moment';

function generateSplitContent() {
  const head = '<p>' + faker.lorem.sentences() + '</p>';
  const tail = '<p>' + faker.lorem.paragraphs() + '</p>';

  return {head: head, tail: tail};
}

export default Factory.extend({
  afterCreate(content, server) {
    if (isBlank(get(content, 'location'))) {
      const numberOfLocations = server.db.locations.length;

      let randomLocationId = Math.ceil(Math.random() * Math.floor(numberOfLocations));

      if (numberOfLocations === 0 || randomLocationId === 0) {
        const newLocation = server.create('location');
        randomLocationId = newLocation.id;
      }

      content.update({
        locationId: randomLocationId
      });
    }

    if (content.contentType === 'event' && !content.eventInstances.length) {
      let newEndDate = moment(content.startsAt).add(1, 'hours').toDate();

      content.update({endsAt: newEndDate});

      server.createList('event-instance', 3, {
        event: content.id,
        startsAt: content.startsAt,
        endsAt: newEndDate
      });
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

  // This was random, but it caused issues with debugging tests that would
  // randomly fail.  We should move these random boolean values, which can
  // alter the presentation drastically, to the development scenario. So
  // we can have more predictable tests.
  contentOrigin: 'ugc',

  canEdit() { return faker.random.arrayElement([true, false]); },

  authorId() { return faker.random.number(9999); },
  authorName() { return faker.name.findName(); },
  avatarUrl() { return faker.image.avatar(); },

  viewCount() { return faker.random.number(999); },

  /*eventInstances() {
    if (this.contentType === 'event') {
      return [];
    }
  },*/

  eventInstanceId() {
    if(this.eventInstances && this.eventInstances.length) {
      return this.eventInstances[0].id;
    }
  },
  venueName() {
    if(this.contentType === 'event') {
      return faker.random.arrayElement(["Grannie's Garage", "Krusty Kastle", "Club Hee-Haw", "Chez Charli"]);
    }
  },
  venueAddress() {
    if(this.contentType === 'event') {
      return faker.address.streetAddress();
    }
  },
  venueCity() {
    if(this.contentType === 'event') {
      return faker.address.city();
    }
  },
  venueState() {
    if(this.contentType === 'event') {
      return 'VT';
    }
  },
  venueZip() {
    if(this.contentType === 'event') {
      return faker.address.zipCode();
    }
  },
  cost() { return faker.random.arrayElement(['Free', `$${faker.random.number(999)}`]); },
  startsAt() {
    if(this.contentType === 'event') {
      let rangeStart = moment().add(1, 'days').toDate();
      let rangeEnd = moment(rangeStart).add(1, 'days').toDate();

      return faker.date.between(rangeStart, rangeEnd);
    }
  },
  endsAt() {
    if(this.contentType === 'event') {
      let rangeStart = moment().add(3, 'days').toDate();
      let rangeEnd = moment(rangeStart).add(1, 'days').toDate();

      return faker.date.between(rangeStart, rangeEnd);
    }
  },

  publishedAt() { return faker.date.past(); },
  updatedAt() { return faker.date.past(); },

  bizFeedPublic() { return faker.random.arrayElement([true, false]); },

  organization: association(),

  organizationName() { return faker.company.companyName(); },
  organizationProfileImageUrl() { return faker.image.business(); },

  imageUrl: 'http://placeholdit.imgix.net/~text?txtsize=33&txt=400%C3%97240&w=400&h=240',
  images() {
    return [{
      id: 1,
      content_id: this.id,
      caption() { return faker.lorem.sentence(); },
      credit: null,
      image_url: this.imageUrl,
      primary: true,
      width: 266,
      height: 200
    },
    {
      id: 2,
      content_id: this.id,
      caption() { return faker.lorem.sentence(); },
      credit: null,
      image_url: this.imageUrl,
      primary: false,
      width: 266,
      height: 200
    }];
  },
  price() { return `$${faker.random.number(999)} OBO`; },
  sold() { return faker.random.arrayElement([true, false]); }
});

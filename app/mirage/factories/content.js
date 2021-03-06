import { isBlank } from '@ember/utils';
import { get } from '@ember/object';
import { Factory, faker } from 'ember-cli-mirage';
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

    let caster = get(content, 'caster');

    if (isBlank(caster)) {
      const numberOfCasters = server.db.casters.length;

      let randomCasterId = Math.ceil(Math.random() * Math.floor(numberOfCasters));

      if (numberOfCasters === 0 || randomCasterId === 0) {
        caster = server.create('caster');
      } else {
        caster = server.db.casters.find(randomCasterId);
      }
      content.update({
        casterId: caster.id
      });
    }

    if (content.contentType === 'event') {
      if (!content.eventInstances.length) {

        let instances = [];
        for (var i=0;i<3;i++) {
          let newStartDate = moment(content.startsAt).add(i+1, 'day').toDate();
          let newEndDate = moment(newStartDate).add(4, 'hours').toDate();
          let instance = server.create('event-instance', {
            id: i+1,
            event: content.id,
            startsAt: newStartDate,
            endsAt: newEndDate
          });
          instances.push(instance);
        }

        content.update({
          eventInstances: instances,
          eventInstanceId: instances[0].id
        });
      } else {
        content.update({
          eventInstanceId: content.eventInstances.models.firstObject.id
        });
      }
    }
  },

  title()    { return faker.company.catchPhrase(); },
  subtitle() { return faker.lorem.sentence(); },
  contentType(id) {
    const contentTypes = ['news', 'event', 'market'];
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


  likeCount() { return faker.random.number(999); },
  viewCount() { return faker.random.number(999); },

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

  imageUrl: 'https://via.placeholder.com/400x240.png?text=400x240',
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

import Mirage, { faker } from 'ember-cli-mirage';
import { titleize } from '../support/utils';
import moment from 'moment';

/*
function otherInstance(server, ) {
  return server.create('other-event-instance', {
    ends_at: faker.date.future(),
    starts_at: faker.date.past(),
    id: faker.random.number(9999),
    subtitle: faker.lorem.sentence(),
    title: faker.lorem.sentence()
  });
}
*/
export default Mirage.Factory.extend({
  adminContentUrl() { return `http://${faker.internet.domainName()}`; },
  eventId() { return faker.random.number(100);},
  canEdit: true,
  title() { return titleize(faker.lorem.sentences(1));},
  subtitle() { return titleize(faker.lorem.sentences(1));},
  commentCount() { return faker.random.number(8);},
  content() { return `<p>${faker.lorem.paragraph(5)}</p>`;},
  contentId() { return faker.random.number(1000);},
  cost: '$15-$55',
  contactPhone() { return faker.phone.phoneNumber();},
  contactEmail() { return faker.internet.email();},
  eventUrl() { return `http://${faker.internet.domainName()}`;},
  venueId() { return faker.random.number(1000);},
  venueName(id) { return (id % 3 === 0) ? titleize(faker.lorem.words(3)) : null;},
  venueAddress() { return faker.address.streetAddress();},
  venueCity() { return faker.address.city();},
  venueState: 'VT',
  venueZip() { return faker.address.zipCode();},
  venueUrl() { return `http://${faker.internet.domainName()}`;},
  registrationUrl() { return `http://${faker.internet.domainName()}`;},
  registrationPhone() { return faker.phone.phoneNumber();},
  registrationEmail() { return faker.internet.email();},
  startsAt() {
    const startHour = faker.random.number({min: 7, max: 12});
    const startsAt = moment(faker.date.recent(-90)).hour(startHour).minute(0).second(0);

    return startsAt.toISOString();
  },
  endsAt() {
    const startsAt = Date.parse(this.startsAt);
    // All are up to 8 hours long so they don't go past midnight
    const hourSpan = faker.random.number({min: 2, max: 8});
    const endsAt = moment(startsAt).add(hourSpan, 'hours');

    return endsAt.toISOString();
  },
  imageUrl(id) { return (id % 2 === 0) ? 'https://via.placeholder.com/400x240.png?text=400x240' : null;},
  updatedAt() { return moment(faker.date.recent(-1)).toISOString();},
  publishedAt() { return moment(faker.date.recent(-5)).toISOString();},

  organizationName() { return faker.company.companyName(); },
  organizationProfileImageUrl() { return faker.image.business(); },
  authorName() { return faker.name.findName(); },
  avatarUrl() { return faker.image.avatar(); },
  contentOrigin: 'ugc',
  authorId() { return faker.random.number(9999); },
  /*eventInstances() {
    let instancesArray = [];
    const iterations = 3;
    for (var i=0; i<iterations; i++) {
      instancesArray.push(otherInstance());
    }
    return instancesArray;
  },*/
  afterCreate(eventInstance, server) {
    if (!eventInstance.eventInstances || eventInstance.eventInstances.length === 0) {
      server.createList('other-event-instance', 3, {
        ends_at: faker.date.future(),
        starts_at: faker.date.past(),
        id: faker.random.number(9999),
        subtitle: faker.lorem.sentence(),
        title: faker.lorem.sentence()
      });
    }
  }
});

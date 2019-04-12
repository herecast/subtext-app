import { isBlank } from '@ember/utils';
import { Factory, faker } from 'ember-cli-mirage';
import moment from 'moment';

export default Factory.extend({
  name() { return faker.name.findName(); },
  email() { return faker.internet.email(); },
  createdAt() { return moment(faker.date.recent(-30)).toISOString(); },
  userImageUrl() {
    var randomNumber = Math.random();
    return (randomNumber > 0.5) ? null : 'https://via.placeholder.com/200x200.png?text=200x200';
  },
  testGroup: 'Consumer',

  canPublishNews: true,
  userId(id) { return id; },
  hasHadBookmarks: false,

  afterCreate(user, server) {
    if (isBlank(user.location)) {
      const newLocation = server.create('location');

      user.update({
        locationId: newLocation.id
      });
    }
  }
});

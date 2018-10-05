import {Factory, faker} from 'ember-cli-mirage';
import moment from 'moment';
import Ember from 'ember';

const { isBlank } = Ember;

export default Factory.extend({
  name() { return faker.name.findName(); },
  email() { return faker.internet.email(); },
  createdAt() { return moment(faker.date.recent(-30)).toISOString(); },
  userImageUrl() {
    var randomNumber = Math.random();
    return (randomNumber > 0.5) ? null : 'https://placeholdit.imgix.net/~text?txtsize=18&txt=Avatar&w=200&h=200';
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

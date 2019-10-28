import { get } from '@ember/object';
import { isBlank } from '@ember/utils';
import Mirage, { faker } from 'ember-cli-mirage';

export default Mirage.Factory.extend({
  activeFollowersCount() { return faker.random.number(999); },
  avatarImageUrl() {
    return faker.random.arrayElement([
      faker.image.business(),
      null
    ]);
  },

  description() { return faker.lorem.paragraph(); },
  backgroundImageUrl() {
    return faker.random.arrayElement([
      faker.image.business(),
      null
    ]);
  },
  phone() { return '8022951559'; },
  name() { return faker.name.findName(); },
  email() { return faker.internet.email(); },
  handle() { return faker.internet.userName(); },
  userId(id) { return id; },

  totalCommentCount() { return faker.random.number(99); },
  totalLikeCount() { return faker.random.number(999); },
  totalPostCount() { return faker.random.number(999); },
  totalViewCount() { return faker.random.number(9999999); },

  userHideCount() { return faker.random.number(999); },
  website() { return 'http://' + faker.internet.domainName(); },

  afterCreate(caster, server) {
    if (isBlank(caster.location)) {
      const newLocation = server.create('location');

      caster.update({
        locationId: newLocation.id
      });
    }

    const userId = get(caster, 'userId') || false;

    if (!userId) {
      const currentUserModel = server.create('current-user', {
        id: get(caster, 'id'),
        userId: get(caster, 'id'),
        casterHideIds: get(caster, 'casterHideIds'),
        casterFollowIds: get(caster, 'casterFollowIds'),
        email: get(caster, 'email')
      });

      caster.update(currentUserModel.attrs);
    }
  }
});

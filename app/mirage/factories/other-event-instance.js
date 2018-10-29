import Mirage, { faker } from 'ember-cli-mirage';

export default Mirage.Factory.extend({
  title()    { return faker.lorem.sentence(); },
  subtitle()    { return faker.lorem.sentence(); },
  startsAt() { return faker.date.future(); },
  endsAt() { return faker.date.future(); }
});

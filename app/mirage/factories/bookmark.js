import { Factory } from 'ember-cli-mirage';

export default Factory.extend({
  read() { return faker.random.arrayElement([true, false]); }
});

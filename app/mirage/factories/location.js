import Mirage, {faker} from 'ember-cli-mirage';

export default Mirage.Factory.extend({
  city() {
    return faker.address.city();
  },
  state: 'VT',
  id() {
    return `${this.city}-${this.state}`.toLowerCase().replace(/\s+/g,'-');
  }
});

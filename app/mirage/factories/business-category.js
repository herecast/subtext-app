import Mirage, {faker} from 'ember-cli-mirage';

export default Mirage.Factory.extend({
  name() { return faker.company.bsNoun(); },
  description() { return faker.company.catchPhrase(); },
  iconClass() { return faker.helpers.shuffle('fa-anchor', 'fa-bank', 'fa-car', 'fa-coffee', 'fa-building', 'fa-hotel', 'fa-shopping-basket'); }
});

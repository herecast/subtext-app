import Mirage, {faker} from 'ember-cli-mirage';

export default Mirage.Factory.extend({
  email() { return faker.internet.email(); },
  name: "John Doe",
});

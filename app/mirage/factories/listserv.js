import Mirage, {faker} from 'ember-cli-mirage';

export default Mirage.Factory.extend({
  name() { return `${faker.address.city()} Listserv`; },
  next_digest_send_time() { return (new Date()).toISOString(); }
});

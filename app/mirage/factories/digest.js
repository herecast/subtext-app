import Mirage, {faker} from 'ember-cli-mirage';

export default Mirage.Factory.extend({
  name(id) { return `Listserv Digest ${id}`; },
  digestDescription() { return faker.lorem.sentence(); },
  digestSendTime: '13:00',
  nextDigestSendTime: '13:00',
  digestSendDay: 'Tuesday'
});

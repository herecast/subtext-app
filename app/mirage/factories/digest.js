import Mirage, {faker} from 'ember-cli-mirage';

export default Mirage.Factory.extend({
  name(id) { return `Listserv Digest ${id}`; },
  digestDescription() { return faker.lorem.sentence(); },
  digestSendTime: '12:00pm',
  digestSendDay: 'Daily'
});

import { ActiveModelSerializer } from 'ember-cli-mirage';

export default ActiveModelSerializer.extend({
  embed: 'true',
  include: Object.freeze(['location', 'casterHides', 'casterFollows'])
});

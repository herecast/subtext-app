import { Model, belongsTo } from 'ember-cli-mirage';

export default Model.extend({
  carousel: belongsTo(),
  content: belongsTo(),
  organization: belongsTo()
});

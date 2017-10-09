import { Model, hasMany, belongsTo } from 'ember-cli-mirage';

export default Model.extend({
  organization: belongsTo(),
  comments: hasMany('comment')
});

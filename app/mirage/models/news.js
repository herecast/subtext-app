import { Model, belongsTo, hasMany } from 'ember-cli-mirage';

export default Model.extend({
  organization: belongsTo(),
  comments: hasMany('comment')
});

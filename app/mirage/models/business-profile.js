import { Model, hasMany, belongsTo } from 'ember-cli-mirage';

export default Model.extend({
  categories: hasMany('business-category'),
  organization: belongsTo('organization')
});

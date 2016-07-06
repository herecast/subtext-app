import { Model, hasMany } from 'ember-cli-mirage';

export default Model.extend({
  //parents: hasMany('business-category'),
  //child_categories: hasMany('business-category'),
  businesses: hasMany('business-profile')
});

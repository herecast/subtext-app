import { Model, hasMany } from 'ember-cli-mirage';

export default Model.extend({
  parents: hasMany('business-category', { inverse: null }),
  child_categories: hasMany('business-category', { inverse: null }),
//  businesses: hasMany('business-profile')
});

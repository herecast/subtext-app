import { Model, hasMany, belongsTo } from 'ember-cli-mirage';

export default Model.extend({
  managedOrganizations: hasMany('organization'),
  bookmarks: hasMany('bookmark'),
  location: belongsTo()
});

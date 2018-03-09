import { Model, hasMany } from 'ember-cli-mirage';

export default Model.extend({
  managedOrganizations: hasMany('organization'),
  bookmarks: hasMany('bookmark')
});

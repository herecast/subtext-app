import { Model, hasMany, belongsTo } from 'ember-cli-mirage';

export default Model.extend({
  managedOrganizations: hasMany('organization'),
  bookmarks: hasMany('bookmark'),
  location: belongsTo(),
  organizationHides: hasMany('organization-hide'),
  organizationSubscriptions: hasMany('organization-subscription')
});

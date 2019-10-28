import { Model, hasMany, belongsTo } from 'ember-cli-mirage';

export default Model.extend({
  bookmarks: hasMany('bookmark'),
  location: belongsTo(),
  casterHides: hasMany('caster-hide'),
  casterFollows: hasMany('caster-follow')
});

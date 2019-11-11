import { Model, hasMany, belongsTo } from 'ember-cli-mirage';

export default Model.extend({
  likes: hasMany('like'),
  location: belongsTo(),
  casterHides: hasMany('caster-hide'),
  casterFollows: hasMany('caster-follow')
});

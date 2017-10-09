import { Model, hasMany, belongsTo } from 'ember-cli-mirage';

export default Model.extend({
  eventInstances: hasMany('other-event-instance'),
  organization: belongsTo('organization'),
  comments: hasMany('comment')
});

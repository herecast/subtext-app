import { Model, hasMany } from 'ember-cli-mirage';

export default Model.extend({
  eventInstances: hasMany('other-event-instance')
});

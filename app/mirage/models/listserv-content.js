import { Model, belongsTo } from 'ember-cli-mirage';

export default Model.extend({
  user: belongsTo('user'),
  listserv: belongsTo('listserv'),
  subscription: belongsTo('subscription'),
});

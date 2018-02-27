import DS from 'ember-data';

export default DS.Model.extend({
  feedItems: DS.hasMany('feed-item'),
  comments: DS.hasMany('comment'),
  subscriptions: DS.hasMany('subscription'),
  currentUser: DS.belongsTo('current-user')
});

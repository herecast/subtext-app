import Ember from 'ember';

export default Ember.Component.extend({
  classNames: 'Feed-IndexFeed',

  feedContents: null,
  organization: null,
  canManage: false,
  displayAsPublic: false
});

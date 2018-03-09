import Ember from 'ember';

export default Ember.Component.extend({
  classNames: 'Feed-IndexFeed',

  feedItems: null,
  showingDetailInFeed: null,
  isSearchActive: false,
  condensedView: false,
  canEditIfAllowed: false,
  canManage: false
});

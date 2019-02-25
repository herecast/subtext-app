import Component from '@ember/component';

export default Component.extend({
  classNames: 'Feed-IndexFeed',

  feedItems: null,
  isSearchActive: false,
  condensedView: false,
  canEditIfAllowed: false,
  canManage: false
});

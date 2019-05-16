import Component from '@ember/component';

export default Component.extend({
  classNames: 'Feed-IndexFeed',

  feedItems: null,
  isSearchActive: false,
  canEditIfAllowed: false,
  canManage: false
});

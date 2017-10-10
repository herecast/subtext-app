import Ember from 'ember';

const {get, computed, inject} = Ember;

export default Ember.Component.extend({
  classNames: 'FeedCard-Footer',

  fastboot: inject.service(),

  locationTagName: null,
  canEdit: false,
  editRoute: null,
  editRouteId: null,

  hasSource: computed.notEmpty('locationTagName'),

  showEditButton: computed('canEdit', 'fastboot.isFastBoot', function() {
    return get(this, 'canEdit') && !get(this, 'fastboot.isFastBoot');
  })
});

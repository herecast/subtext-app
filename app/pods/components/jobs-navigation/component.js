import Ember from 'ember';

const {get, isPresent, computed, inject} = Ember;

export default Ember.Component.extend({
  classNames: ['JobsNavigation'],
  classNameBindings: [
    'noFooterImage:JobsNavigation--noFooterImage'
  ],

  noFooterImage: false,
  organization: null,
  hideTalk: false,

  tracking: inject.service(),

  /**
   * We want to specifically return `null` if no organization ID is present (eg. not `undefined`)
   * so our link-to will always set the correct value for the optional query param.
   */
  organizationId: computed('organization.id', function() {
    const organizationId = get(this, 'organization.id');
    return (isPresent(organizationId)) ? organizationId : null;
  }),

  actions: {
    selectedMenuItem(job) {
      get(this, 'tracking').trackUGCJobClick(job);
    }
  }
});

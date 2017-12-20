import Ember from 'ember';

const {get, isPresent, computed, inject} = Ember;

export default Ember.Component.extend({
  classNames: ['JobsNavigation-Profile'],

  organization: null,

  tracking: inject.service(),

  organizationId: computed('organization.id', function() {
    const organizationId = get(this, 'organization.id');
    return (isPresent(organizationId)) ? organizationId : null;
  }),

  showBusinessOptions: computed.alias('organization.isBusiness'),
  showBlogOptions: computed.or('organization.{isBlog,isPublisher,isPublication}'),

  actions: {
    selectedMenuItem(job) {
      get(this, 'tracking').trackUGCJobClick(job);
    }
  }
});

import Component from '@ember/component';
import { isPresent } from '@ember/utils';
import { computed, get } from '@ember/object';
import { inject as service } from '@ember/service';

export default Component.extend({
  classNames: ['JobsNavigation'],
  classNameBindings: [
    'noFooterImage:JobsNavigation--noFooterImage'
  ],

  noFooterImage: false,
  organization: null,

  session: service(),
  tracking: service(),

  canPublishNews: computed('session.currentUser', 'organization', function() {
    const organization = get(this, 'organization');

    if (isPresent(organization)) {
      return get(this, 'organization.canPublishNews');
    }

    return get(this, 'session.currentUser.canPublishNews');
  }),

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

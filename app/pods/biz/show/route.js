import Ember from 'ember';

const {
  get,
  set,
  RSVP:{hash},
  inject:{service}
} = Ember;

export default Ember.Route.extend({
  tracking: service(),
  fastboot: service(),
  notify: service('notification-messages'),

  queryParams: {
    query: {
      replace: true,
      refreshModel: true
    }
  },

  model(params) {
    return hash({
      businessProfile: this.store.queryRecord('business-profile', {'organization_id': params.id}),
      organizationContents: this.store.query('organization-content', {
        'query' : params.query,
        'organization_id': params.id,
        'per_page':10000
      })
    });
  },

  afterModel(models) {
    //Note: Need to remove this route and create rewrite to profile
    const organizationId = get(models.businessProfile, 'organization_id');

    if (!get(this, 'fastboot.isFastBoot')) {
      get(this, 'notify').warning(
        `<div>This URL will expire January 10, 2018, but this page lives on.
        <a href="/profile/${organizationId}">Click to see and bookmark the new version!</a></div>`,
        {
          htmlContent: true,
          autoClear: false
        }
      );
    }
  },

  setupController(controller, models) {
    const businessProfile = models.businessProfile;
    const organization = get(businessProfile, 'organization');

    controller.setProperties({
      organization: organization,
      business: businessProfile,
      contents: models.organizationContents,
      isFirstTransition: true
    });

    set(this, 'title', `${models.businessProfile.get('name')} on DailyUV`);

    this._super(...arguments);
  },

  actions: {
    didTransition() {
      const controller = this.controllerFor('biz.show');
      const isFirstTransition = controller.get('isFirstTransition');

      if(!get(this, 'fastboot.isFastBoot')) {
        const model = this.modelFor(this.routeName).businessProfile;

        model.get('organization').then((organization) => {
          get(this, 'tracking').profileImpression(
            organization
          );
        });

        if(isFirstTransition) {
          Ember.$(window).scrollTop(0);
          controller.set('isFirstTransition', false);
        }
      }
    }
  }
});

import Ember from 'ember';

const {get, set, RSVP:{hash}, inject:{service}} = Ember;

export default Ember.Route.extend({
  queryParams: {
    query: {
      replace: true,
      refreshModel: true
    }
  },

  fastboot: service(),

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
    //Note: Check here to see if ad team has turned on business profile page
    const businessProfile = models.businessProfile;
    const bizFeedActive = get(businessProfile, 'bizFeedActive');

    if (!bizFeedActive) {
      this.transitionTo('directory.show', get(businessProfile, 'id'));
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

      if (!get(this, 'fastboot.isFastBoot') && isFirstTransition) {
        Ember.$(window).scrollTop(0);
        controller.set('isFirstTransition', false);
      }
    }
  }
});

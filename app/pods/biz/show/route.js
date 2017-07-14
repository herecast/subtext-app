import Ember from 'ember';

const {get, set, RSVP:{hash}, inject:{service}} = Ember;

export default Ember.Route.extend({
  fastboot: service(),

  model(params) {
    return hash({
      businessProfile: this.store.queryRecord('business-profile', {'organization_id': params.id}),
      organizationContents: this.store.query('organization-content', {'organization_id': params.id, 'per_page':10000})
    });
  },

  setupController(controller, models) {
    const organization = get(models.businessProfile, 'organization');

    controller.setProperties({
      organization: organization,
      business: models.businessProfile,
      contents: models.organizationContents,
      isFirstTransition: true
    });

    set(this, 'title', `${models.businessProfile.get('name')} on DailyUV`);

    set(this.controllerFor('application'), 'channelLinksEnabled', false);

    this._super(...arguments);
  },

  actions: {
    willTransition(transition) {
      if (!transition.targetName.startsWith('biz.')) {
        set(this.controllerFor('application'), 'channelLinksEnabled', true);
      }
    },

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

import Ember from 'ember';

const { get, inject:{service} } = Ember;

export default Ember.Route.extend({
  store: service(),

  model() {
    const controller = this.controllerFor('startablog');

    return get(this, 'store').createRecord('organization', {
      name: 'Jennifer',
      profileImageUrl: get(controller, 'avatarUrls.profile'),
      backgroundImageUrl: get(controller, 'avatarUrls.background'),
      email: 'jennifer@dailyuv.com',
      website: 'http://instagram.com/thedailyuv',
      description: 'Jennifer is an amazing part of the team at DailyUV. She has done wonderful work in the world of the Upper Valley.',
      orgType: 'Blog'
    });
  },

  actions: {
    didTransition() {
      window.scrollTo(0, 0);
      Ember.$('html').addClass('modal-open');
    },

    willTransition() {
      Ember.$('html').removeClass('modal-open');
    }
  }
});

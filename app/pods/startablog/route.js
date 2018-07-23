import Ember from 'ember';

const { get, inject:{service} } = Ember;

export default Ember.Route.extend({
  store: service(),

  model() {
    const controller = this.controllerFor('startablog');

    return get(this, 'store').createRecord('organization', {
      name: 'Best of the UV',
      profileImageUrl: get(controller, 'avatarUrls.profile'),
      backgroundImageUrl: get(controller, 'avatarUrls.background'),
      email: 'bestoftheuv@gmail.com',
      website: 'http://instagram.com/thedailyuv',
      description: "A blog of the best of everything in the Upper Valley—according to the people who live here and know best. Each week I'll post a topic (best sandwich, best village green, best museum, etc.) and invite readers to share their favorites in the comments. Then I'll pull together your recommendations into THE definitive list. Me? I'm just the messenger, but of course I have my favorites, too! Want to suggest a best-of topic? Email me at bestoftheuv@gmail.com.",
      orgType: 'Blog',
      hoursCardActive: false
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

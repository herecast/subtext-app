import Ember from 'ember';

export default Ember.Component.extend({
  tagName: 'a',
  attributeBindings: ['href'],

  router: null,
  applicationController: null,

  href: function() {
    const router = this.get('router');

    if (router) {
      const redirectTo = this.get('redirectTo');
      const pathname = redirectTo || router.location.location.pathname;

      return `/users/sign_in?after_sign_in_path=${pathname}`;
    } else {
      return '';
    }
  }.property('applicationController.currentPath')
});

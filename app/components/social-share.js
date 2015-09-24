import Ember from 'ember';
/* global FB */

export default Ember.Component.extend({
  classNames: ['SocialShare'],

  actions: {
    shareFacebook() {
      FB.ui({
        method: 'share',
        href: `${location.protocol}//${location.host}${location.pathname}`
      }, function(){});
    }
  }
});

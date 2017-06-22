import Ember from 'ember';
import CookiesService from 'ember-cookies/services/cookies';

export default CookiesService.extend({

  read(name) {
    if(Ember.testing) {
      const cookies = this.get('_testCookies') || {};
      return cookies[name];
    } else {
      return this._super(...arguments);
    }
  },

  write(name, value) {
    if(Ember.testing) {
      const cookies = this.get('_testCookies') || {};
      cookies[name] = value;
      this.set('_testCookies', cookies);
    } else {
      return this._super(...arguments);
    }
  }
});

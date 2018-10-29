import { get } from '@ember/object';
import CookiesService from 'ember-cookies/services/cookies';

export default CookiesService.extend({
//NOTE: Need to check this after upgrade as to how to know in testing mode
  isTesting: false,

  read(name) {
    if (get(this, 'isTesting')) {
      const cookies = this.get('_testCookies') || {};
      return cookies[name];
    } else {
      return this._super(...arguments);
    }
  },

  write(name, value) {
    if (get(this, 'isTesting')) {
      const cookies = this.get('_testCookies') || {};
      cookies[name] = value;
      this.set('_testCookies', cookies);
    } else {
      return this._super(...arguments);
    }
  }
});

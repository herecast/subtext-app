import Ember from 'ember';

const { inject, set, get } = Ember;

export default Ember.Mixin.create({
  fastboot: inject.service(),
  titleToken: '404 - Not Found',

  setupController() {
    if (get(this, 'fastboot.isFastBoot')) {
      let statusCode = get(this, 'fastboot.response.statusCode');
      if (String(statusCode) === '200') {
        set(this, 'fastboot.response.statusCode', 404);
      }
    }
  }
});

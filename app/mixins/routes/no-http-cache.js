import Ember from 'ember';

const {
  inject,
  get
} = Ember;

export default Ember.Mixin.create({
  fastboot: inject.service(),

  actions: {
    didTransition() {
      this._super();

      if(get(this, 'fastboot.isFastBoot')) {
        const resHeaders = get(this, 'fastboot.response.headers');
        resHeaders.set('Cache-Control', ' no-cache, no-store, must-revalidate');
      }
    }
  }
});

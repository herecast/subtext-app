import Ember from 'ember';

const {
  inject,
  get,
  computed,
  RSVP: {Promise}
} = Ember;

export default Ember.Mixin.create({
  fastboot: inject.service(),
  isFastBoot: computed.reads('fastboot.isFastBoot'),

  /**
   * We wrap deferRendering to ensure it's promise always resolves,
   * because the fastboot server will die if the promise rejects.
   */
  deferRenderingIfFastboot(promise) {
    const fastboot = get(this, 'fastboot');

    if(get(fastboot, 'isFastBoot')) {
      return fastboot.deferRendering(new Promise((resolve) => {
        promise.then(resolve, resolve);
      }));
    }
  }
});

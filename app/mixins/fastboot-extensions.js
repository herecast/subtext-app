import { inject as service } from '@ember/service';
import { reads } from '@ember/object/computed';
import Mixin from '@ember/object/mixin';
import { get } from '@ember/object';
import { Promise } from 'rsvp';

export default Mixin.create({
  fastboot: service(),
  isFastBoot: reads('fastboot.isFastBoot'),

  /**
   * We wrap deferRendering to ensure it's promise always resolves,
   * because the fastboot server will die if the promise rejects.
   */
  deferRenderingIfFastboot(promise) {
    const fastboot = get(this, 'fastboot');

    if(get(fastboot, 'isFastBoot')) {
      fastboot.deferRendering(new Promise((resolve) => {
        promise.then(resolve, resolve);
      }));
    }

    return promise;
  }
});

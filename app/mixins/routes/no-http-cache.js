import { inject as service } from '@ember/service';
import Mixin from '@ember/object/mixin';
import { get } from '@ember/object';

export default Mixin.create({
  fastboot: service(),

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

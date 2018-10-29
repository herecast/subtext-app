import { inject as service } from '@ember/service';
import Mixin from '@ember/object/mixin';
import { get, set } from '@ember/object';

export default Mixin.create({
  fastboot: service(),
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

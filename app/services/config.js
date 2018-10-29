/* global process */
import { reads } from '@ember/object/computed';

import Service, { inject as service } from '@ember/service';
import { set, get, setProperties } from '@ember/object';
import config from 'subtext-ui/config/environment';

export default Service.extend({
  fastbootService: service(),
  isFastBoot: reads('fastbootService.isFastBoot'),

  init() {
    this._super(...arguments);

    setProperties(this, {
      env: {}
    });

    if(get(this, 'isFastBoot')) {
      this._configureServerSide();
    } else {
      this._configureClientSide();
    }
  },

  _configiureServerSide() {
    const envKeys = config.envKeys || [];
    envKeys.forEach((k) => {
      if(k in process.env) {
        set(this, `env.${k}`, process.env[k]);
      }
    });

    const shoebox = get(this, 'fastbootService.shoebox');
    shoebox.put('env-store', get(this, 'env'));
  },
  _configureClientSide() {
  }
});

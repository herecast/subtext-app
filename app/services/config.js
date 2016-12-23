/* global process */
import Ember from 'ember';
import config from 'subtext-ui/config/environment';

const { get, set, inject, computed } = Ember;

export default Ember.Service.extend({
  env: {},

  fastbootService: inject.service(),
  isFastBoot: computed.reads('fastbootService.isFastBoot'),

  init() {
    this._super(...arguments);

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

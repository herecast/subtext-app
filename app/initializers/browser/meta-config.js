import Ember from 'ember';
import config from 'subtext-ui/config/environment';

export function initialize() {
  (config.envOverrides || []).forEach((name) => {
    const metaName = name.dasherize().toLowerCase();
    const value = Ember.$(`meta[name=${metaName}]`).attr('content');

    if (value) {
      config[name] = value;
    }
  });
}

export default {
  name: 'meta-config',
  initialize: initialize
};

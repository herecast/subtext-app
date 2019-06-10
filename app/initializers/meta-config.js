import $ from 'jquery';
import config from 'subtext-app/config/environment';

export function initialize() {
  if (typeof FastBoot === 'undefined') {
    (config.envOverrides || []).forEach((name) => {
      const metaName = name.dasherize().toLowerCase();
      const value = $(`meta[name=${metaName}]`).attr('content');

      if (value) {
        config[name] = value;
      }
    });
  }
}

export default {
  name: 'meta-config',
  initialize: initialize
};

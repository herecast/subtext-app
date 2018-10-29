/* global FastBoot */
import { get } from '@ember/object';

import { isPresent } from '@ember/utils';
import config from 'subtext-ui/config/environment';

export function initialize(appInstance) {
  const headData = appInstance.lookup('service:headData');
  const envTags = [];
  const env = get(FastBoot.require('process'), 'env');

  (config.envOverrides || []).forEach((name) => {
    var val = env[name];

    if(isPresent(val)) {
      config[ name ] = val;

      const metaName = name.dasherize().toLowerCase();

      // ember-cli-meta-tags
      envTags.push({
        type: 'meta',
        attrs: {
          name: metaName,
          content: val
        }
      });
    }
  });

  // Inject meta tags for browser version to pickup
  headData.set('envTags', envTags);
}

export default {
  name: 'env-to-config',
  initialize
};

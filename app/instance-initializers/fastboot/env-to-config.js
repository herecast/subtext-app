/* global FastBoot */
import config from 'subtext-ui/config/environment';
import Ember from 'ember';

const { get, isPresent } = Ember;

export function initialize(appInstance) {
  const headData = appInstance.lookup('service:headData');
  const envTags = [];
  const env = get(FastBoot.require('process'), 'env');

  (config.envOverrides || []).forEach((name) => {
    var val = env[name];

    if(isPresent(val)) {
      config[ name ] = val;

      // ember-cli-meta-tags
      envTags.push({
        type: 'meta',
        attrs: {
          name: name,
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

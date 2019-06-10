import { isPresent } from '@ember/utils';
import config from 'subtext-app/config/environment';

export function initialize(appInstance) {
  const fastboot = appInstance.lookup('service:fastboot');

  if(fastboot.get('isFastBoot') && isPresent(config['DEFAULT_HTTP_CACHE'])) {
    const resHeaders = fastboot.get('response.headers');

    resHeaders.set('Cache-Control', config.DEFAULT_HTTP_CACHE);
  }
}

export default {
  name: 'fastboot/default-cache-headers',
  initialize
};

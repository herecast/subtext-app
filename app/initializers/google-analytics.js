import config from 'subtext-ui/config/environment';

/* global ga */

export function initialize(/* application */) {
  const propertyId = config['ganalytics-api-token'];

  if (propertyId) {
    ga('create', propertyId, 'auto');
  }
}

export default {
  name: 'google-analytics',
  after: 'meta-config',
  initialize
};

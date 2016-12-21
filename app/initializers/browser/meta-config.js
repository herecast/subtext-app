import Ember from 'ember';
import config from 'subtext-ui/config/environment';

export function initialize() {
  [
    'consumer-app-uri',
    'gmaps-api-token',
    'intercom-api-token',
    'facebook-app-id',
    'prerender-io-token',
    'gtm-api-token',
    'gtm-auth',
    'gtm-preview'
  ].forEach((name) => {
    const value = Ember.$(`meta[name=${name}]`).attr('content');

    if (value) {
      config[name] = value;
    }
  });
}

export default {
  name: 'meta-config',
  initialize: initialize
};
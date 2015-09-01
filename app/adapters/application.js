import DS from 'ember-data';
import config from './../config/environment';

export default DS.ActiveModelAdapter.extend({
  namespace: config.API_NAMESPACE,
  coalesceFindRequests: true,
  headers: {
    'Consumer-App-Uri': 'http://qa-demo.subtext.org/'
  }
});

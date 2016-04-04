import DS from 'ember-data';
import config from './../config/environment';
import DataAdapterMixin from 'ember-simple-auth/mixins/data-adapter-mixin';

export default DS.ActiveModelAdapter.extend(DataAdapterMixin, {
  namespace: config.API_NAMESPACE,
  coalesceFindRequests: true,
  authorizer: 'authorizer:application',
  headers: {
    "Consumer-App-Uri": config['consumer-app-uri']
  }
});

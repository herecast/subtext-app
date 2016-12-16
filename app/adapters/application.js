import config from './../config/environment';
import DataAdapterMixin from 'ember-simple-auth/mixins/data-adapter-mixin';
import { ActiveModelAdapter } from 'active-model-adapter';


export default ActiveModelAdapter.extend(DataAdapterMixin, {
  host: config.API_BASE_URL,
  namespace: config.API_NAMESPACE,
  coalesceFindRequests: true,
  authorizer: 'authorizer:application',
  headers: {
    "Consumer-App-Uri": config['CONSUMER_APP_URI']
  }
});

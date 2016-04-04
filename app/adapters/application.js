import Ember from 'ember';
import DS from 'ember-data';
import config from './../config/environment';
import DataAdapterMixin from 'ember-simple-auth/mixins/data-adapter-mixin';

const { computed } = Ember;

export default DS.ActiveModelAdapter.extend(DataAdapterMixin, {
  namespace: config.API_NAMESPACE,
  coalesceFindRequests: true,
  authorizer: 'authorizer:application',
  headers: computed('session.data.secure.token', function() {
    let headers = {
      "Consumer-App-Uri": config['consumer-app-uri']
    };

    if (this.get('session.isAuthenticated')) {
      headers.Authorization = `Token token="${this.get('session.data.secure.token')}" email="${this.get('session.data.secure.email')}"`;
    }

    return headers;
  })
});

import { get } from '@ember/object';
import config from 'subtext-app/config/environment';
import ApplicationAdapter from './application';

export default ApplicationAdapter.extend({
  urlForCreateRecord(modelName, snapshot) {
    const organizationId =  snapshot.attr('organizationId');
    return `${config.API_BASE_URL}/${get(this, 'namespace')}/organizations/${organizationId}/hides`;
  },

  urlForDeleteRecord(id) {
    return `${config.API_BASE_URL}/${get(this, 'namespace')}/organizations/hides/${id}`;
  }
});

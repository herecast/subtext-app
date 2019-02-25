import { get } from '@ember/object';
import ApplicationAdapter from './application';

export default ApplicationAdapter.extend({
  urlForCreateRecord(modelName, snapshot) {
    const organizationId =  snapshot.attr('organizationId');
    return `/${get(this, 'namespace')}/organizations/${organizationId}/hides`;
  },

  urlForDeleteRecord(id) {
    return `/${get(this, 'namespace')}/organizations/hides/${id}`;
  }
});

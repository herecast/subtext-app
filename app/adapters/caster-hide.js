import { get } from '@ember/object';
import config from 'subtext-app/config/environment';
import ApplicationAdapter from './application';

export default ApplicationAdapter.extend({
  urlForCreateRecord(modelName, snapshot) {
    const casterId =  snapshot.attr('casterId');
    return `${config.API_BASE_URL}/${get(this, 'namespace')}/casters/${casterId}/hides`;
  },

  urlForDeleteRecord(id) {
    return `${config.API_BASE_URL}/${get(this, 'namespace')}/casters/hides/${id}`;
  }
});

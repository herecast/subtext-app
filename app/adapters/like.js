import { get } from '@ember/object';
import config from 'subtext-app/config/environment';
import ApplicationAdapter from './application';

export default ApplicationAdapter.extend({
  buildURL(modelName, id, snapshot) {
    const casterId = snapshot.attr('casterId');

    let url = `${config.API_BASE_URL}/${get(this, 'namespace')}/casters/${casterId}/likes`;

    if (id) {
      url += `/${id}`;
    }

    return url;
  }
});

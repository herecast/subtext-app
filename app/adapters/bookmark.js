import { get } from '@ember/object';
import config from 'subtext-app/config/environment';
import ApplicationAdapter from './application';

export default ApplicationAdapter.extend({
  buildURL(modelName, id, snapshot) {
    const userId = snapshot.attr('userId');

    let url = `${config.API_BASE_URL}/${get(this, 'namespace')}/users/${userId}/bookmarks`;

    if (id) {
      url += `/${id}`;
    }

    return url;
  }
});

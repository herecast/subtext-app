import { get } from '@ember/object';
import ApplicationAdapter from './application';

export default ApplicationAdapter.extend({
  buildURL(modelName, id, snapshot) {
    const userId = snapshot.attr('userId');

    let url = `/${get(this, 'namespace')}/users/${userId}/bookmarks`;

    if (id) {
      url += `/${id}`;
    }

    return url;
  }
});

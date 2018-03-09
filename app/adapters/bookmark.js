import ApplicationAdapter from './application';
import Ember from 'ember';

const { get } = Ember;

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

import { get, computed } from '@ember/object';
import { readOnly } from '@ember/object/computed';
import { isBlank } from '@ember/utils';
import { inject as service } from '@ember/service';
import Component from '@ember/component';

export default Component.extend({
  classNames: ['JobsForms-Owner'],

  session: service(),

  model: null,

  hidePublishedTime: computed('model.{publishedAt,contentType}', function() {
    if (get(this, 'model.contentType') !== 'event') {
      return isBlank(get(this, 'model.publishedAt'));
    }

    return true;
  }),

  publishedTime: computed('hidePublishedTime', function() {
    return get(this, 'hidePublishedTime') ? false : get(this, 'model.publishedAtRelative');
  }),

  currentUser: readOnly('session.currentUser'),
  currentUserAttributionName: readOnly('currentUser.attributionName'),
  currentUserAvatarImageUrl: readOnly('currentUser.avatarImageUrl')
});

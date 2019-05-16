import { get, computed } from '@ember/object';
import { notEmpty, gt } from '@ember/object/computed';
import { isPresent } from '@ember/utils';
import Component from '@ember/component';

export default Component.extend({
  classNames: ['FeedCard', 'FeedCard-MidsizeCard'],

  model: null,

  showAnyViewCount: false,

  hasImage: notEmpty('model.primaryImageUrl'),
  hasMultipleImages: gt('model.images.length', 1),
  hasStartDate: computed('model.{contentType,startsAt}', function() {
    const contentType = get(this, 'model.contentType');
    const startsAt = get(this, 'model.startsAt');

    return contentType === 'event' && isPresent(startsAt);
  })
});

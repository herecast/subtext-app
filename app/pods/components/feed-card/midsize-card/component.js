import { get, computed } from '@ember/object';
import { notEmpty, gt, readOnly } from '@ember/object/computed';
import { isPresent } from '@ember/utils';
import Component from '@ember/component';

export default Component.extend({
  classNames: ['FeedCard-MidsizeCard'],
  classNameBindings: ['hideCompletely:hide-completely'],
  'data-test-midsize-card': readOnly('model.title'),

  model: null,

  showAnyViewCount: false,
  hideCompletely: false,

  hasImage: notEmpty('model.primaryImageUrl'),
  hasMultipleImages: gt('model.images.length', 1),
  hasStartDate: computed('model.{contentType,startsAt}', function() {
    const contentType = get(this, 'model.contentType');
    const startsAt = get(this, 'model.startsAt');

    return contentType === 'event' && isPresent(startsAt);
  }),

  showSoldTag: computed('model.{isMarket,sold}', function() {
    return get(this, 'model.isMarket') && get(this, 'model.sold');
  })
});

import { notEmpty, gt, readOnly } from '@ember/object/computed';
import Component from '@ember/component';
import { computed, get } from '@ember/object';
import { isPresent } from '@ember/utils';
import { htmlSafe } from '@ember/template';
import { optimizedImageUrl } from 'subtext-app/helpers/optimized-image-url';

export default Component.extend({
  classNames: ['FeedCard-Image'],
  classNameBindings: ['isMidsize:midsize', 'isCompact:compact'],

  model: null,
  linkUrl: null,
  eventInstanceId: null,
  linkToDetailIsActive: true,
  isMidsize: false,
  isCompact: false,
  onContentClick() {},

  hasImage: notEmpty('imageUrl'),
  hasMultipleImages: gt('model.images.length', 1),
  hasStartDate: computed('model.{contentType,startsAt}', function() {
    const contentType = get(this, 'model.contentType');
    const startsAt = get(this, 'model.startsAt');

    return contentType === 'event' && isPresent(startsAt);
  }),

  futureInstances: readOnly('model.futureInstances'),

  hasFutureDates: computed('futureInstances.[]', 'model.startsAt', function() {
    const numberOfFutureInstances = get(this, 'futureInstances.length');
    const hasNoFutureInstances = numberOfFutureInstances === 0;
    const firstFutureStartsAt = get(this, 'futureInstances.firstObject.startsAt');
    const onlyInstanceIsSameAsModel = numberOfFutureInstances === 1 && firstFutureStartsAt.isSame(get(this, 'model.startsAt'));

    if (hasNoFutureInstances || onlyInstanceIsSameAsModel) {
      return false;
    }

    return  numberOfFutureInstances > 0;
  }),

  imageStyle: computed('imageUrl', function() {
    const imageUrl = get(this, 'imageUrl');
    const options = [imageUrl, 500, 300, true];

    if (isPresent(imageUrl)) {
      return htmlSafe(`background-image: url('${optimizedImageUrl(options)}');`);
    }

    return '';
  })
});

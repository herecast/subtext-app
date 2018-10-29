import { notEmpty } from '@ember/object/computed';
import Component from '@ember/component';
import { computed, get } from '@ember/object';
import { htmlSafe } from '@ember/template';
import { optimizedImageUrl } from 'subtext-ui/helpers/optimized-image-url';

export default Component.extend({
  classNames: ['OrganizationProfileDesktopImage'],

  imageUrl: null,

  showImage: notEmpty('imageUrl'),

  imageStyle: computed('imageUrl', function() {
    const imageUrl = get(this, 'imageUrl');

    if (imageUrl) {
      const options = [imageUrl, 1280, 720, false];

      return htmlSafe(`background-image: url('${optimizedImageUrl(options)}');`);
    }

    return '';
  })
});

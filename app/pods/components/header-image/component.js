import { htmlSafe } from '@ember/template';
import Component from '@ember/component';
import { computed, get } from '@ember/object';
import { optimizedImageUrl } from 'subtext-ui/helpers/optimized-image-url';


export default Component.extend({
  classNames: ['HeaderImage'],
  classNameBindings: [
    'preserveAspectRatio:HeaderImage--preserveAspectRatio',
    'sizeClass',
    'short:HeaderImage--short',
    'block:HeaderImage--block',
    'profileHeader:HeaderImage--profile-header',
    'chooseImage:HeaderImage--chooser'
  ],
  attributeBindings: ['data-test-component'],
  'data-test-component': 'header-image',

  preserveAspectRatio: false,
  size: null, // 'small', 'medium', smallOnMobileMediumOnDesktop
  profileHeader: false,

  chooseImage: false,
  isChoosingImage: false,

  sizeClass: computed('size', function() {
    const size = get(this, 'size');
    return size ? `HeaderImage--${size}` : '';
  }),

  imageStyle: computed('imageUrl', 'profileHeader', function() {
    const imageUrl = get(this, 'imageUrl');

    if (imageUrl) {
      const options = get(this, 'profileHeader') ? [imageUrl, 1280, 720, false] : [imageUrl, 640, 360, false];

      return htmlSafe(`background-image: url('${optimizedImageUrl(options)}');`);
    }

    return htmlSafe(`background: rgba(255,255,255,1);`);
  }),

  actions: {
    chooseImage() {
      if (get(this, 'onChooseImage')) {
        get(this, 'onChooseImage')();
      }
    }
  }
});

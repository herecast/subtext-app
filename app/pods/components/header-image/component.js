import Ember from 'ember';
import { optimizedImageUrl } from 'subtext-ui/helpers/optimized-image-url';

const { get, computed } = Ember;


export default Ember.Component.extend({
  classNames: ['HeaderImage'],
  classNameBindings: [
    'preserveAspectRatio:HeaderImage--preserveAspectRatio',
    'sizeClass',
    'short:HeaderImage--short',
    'block:HeaderImage--block',
    'profileHeader:HeaderImage--profile-header'
  ],
  attributeBindings: [
    'data-test-component', 'style'
  ],
  'data-test-component': 'header-image',

  preserveAspectRatio: false,
  size: null, // 'small', 'medium', smallOnMobileMediumOnDesktop
  profileHeader: false,

  sizeClass: computed('size', function() {
    const size = get(this, 'size');
    return size ? `HeaderImage--${size}` : '';
  }),

  style: computed('imageUrl', function() {
    const imageUrl = get(this, 'imageUrl');

    if (imageUrl) {
      const options = get(this, 'profileHeader') ? [imageUrl, 1280, 720, false] : [imageUrl, 640, 360, false];

      return Ember.String.htmlSafe(`background-image: url('${optimizedImageUrl(options)}');`);
    }

    return Ember.String.htmlSafe(`background: rgba(255,255,255,1);`);
  })
});

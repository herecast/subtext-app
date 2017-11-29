import Ember from 'ember';
import makeOptimizedImageUrl from 'subtext-ui/utils/optimize-image-url';

const { get, computed } = Ember;


export default Ember.Component.extend({
  classNames: ['HeaderImage'],
  classNameBindings: [
    'preserveAspectRatio:HeaderImage--preserveAspectRatio',
    'sizeClass',
    'short:HeaderImage--short',
    'block:HeaderImage--block'
  ],
  attributeBindings: [
    'data-test-component', 'style'
  ],
  'data-test-component': 'header-image',

  preserveAspectRatio: false,
  size: null, // 'small', 'medium', smallOnMobileMediumOnDesktop

  sizeClass: computed('size', function() {
    const size = get(this, 'size');
    return size ? `HeaderImage--${size}` : '';
  }),

  style: computed('imageUrl', function() {
    const imageUrl = get(this, 'imageUrl');

    if (imageUrl) {
      let optimizedImageUrl = makeOptimizedImageUrl(imageUrl, 640, 360, false);

      return Ember.String.htmlSafe(`background-image: url('${optimizedImageUrl}');`);
    }

    return Ember.String.htmlSafe(`background: rgba(255,255,255,1);`);
  })
});

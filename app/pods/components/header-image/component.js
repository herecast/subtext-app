import Ember from 'ember';
import makeOptimizedImageUrl from 'subtext-ui/utils/optimize-image-url';

const { get, computed } = Ember;


export default Ember.Component.extend({
  classNames: ['HeaderImage'],
  classNameBindings: ['preserveAspectRatio:HeaderImage--preserveAspectRatio'],
  attributeBindings: ['data-test-component', 'style'],
  'data-test-component': 'header-image',

  preserveAspectRatio: false,

  style: computed('imageUrl', function() {
    const imageUrl = get(this, 'imageUrl');
    let optimizedImageUrl = makeOptimizedImageUrl(imageUrl, 640, 360, false);

    return Ember.String.htmlSafe(`background-image: url('${optimizedImageUrl}');`);
  })
});

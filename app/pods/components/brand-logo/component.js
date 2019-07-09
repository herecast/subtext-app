import { get, computed } from '@ember/object';
import Component from '@ember/component';

export default Component.extend({
  tagName: 'img',
  classNames: ['BrandLogo'],
  classNameBindings: ['autoWidth:auto-width'],
  attributeBindings: ['src', 'title'],
  title: 'HereCast',
  white: false,
  autoWidth: false,
  src: computed('white', function() {
    let img = 'HC_HORIZ_RGB.png';

    if (get(this, 'white')) {
      img = 'HC_HORIZ_W.png'
    }

    return `/images/${img}`;
  }),

  click() {
    if (get(this, 'onClick')) {
      get(this, 'onClick')();
    }
  }
});

import Component from '@ember/component';
import { get } from '@ember/object';

export default Component.extend({
  tagName: 'img',
  classNames: ['BrandLogo'],
  attributeBindings: ['src', 'title'],
  title: 'Daily UV',
  src: 'https://s3.amazonaws.com/subtext-misc/sierra-nevada/dailyuv-logo-sm.svg',

  click() {
    if (get(this, 'onClick')) {
      get(this, 'onClick')();
    }
  }
});

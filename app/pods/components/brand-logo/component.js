import Ember from 'ember';

export default Ember.Component.extend({
  tagName: 'img',
  classNames: ['BrandLogo'],
  attributeBindings: ['src', 'title'],
  src: 'https://s3.amazonaws.com/subtext-misc/sierra-nevada/dailyuv-logo-with-tagline.svg',
  title: 'Daily UV'
});

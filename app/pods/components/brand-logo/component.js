import Ember from 'ember';

const {
  computed,
  get
} = Ember;

export default Ember.Component.extend({
  tagName: 'img',
  classNames: ['BrandLogo'],
  attributeBindings: ['src', 'title'],
  tagline: true,
  srcWithTagLine: 'https://s3.amazonaws.com/subtext-misc/sierra-nevada/dailyuv-logo-with-tagline.svg',
  srcWithoutTagLine: 'https://s3.amazonaws.com/subtext-misc/sierra-nevada/dailyuv-logo-sm.svg',
  title: 'Daily UV',
  src: computed('tagline', 'srcWithTagline', 'srcWithoutTagLine', function() {
    const tagline = get(this, 'tagline');
    const srcWithTagLine = get(this, 'srcWithTagLine');
    const srcWithoutTagLine = get(this, 'srcWithoutTagLine');

    return (tagline ? srcWithTagLine : srcWithoutTagLine);
  })
});

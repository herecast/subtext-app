import Component from '@ember/component';

/**
 * Inspired by Bootstrap's "media" component, this component will align a media object (such as an image)
 * to the left or right of some content, without that content flowing around the the object.
 * It is likely easier to use this as a contextual component.
 */
export default Component.extend({
  classNames: ['MediaContainer'],
  classNameBindings: [
    'reverse:MediaContainer--reverse',
    'noMargin:MediaContainer--noMargin',
    'noRightMargin:MediaContainer--noRightMargin',
    'centerVertically:MediaContainer--centerVertically'
  ],

  reverse: false,
  noMargin: false,
  noRightMargin: false,
  centerVertically: false
});

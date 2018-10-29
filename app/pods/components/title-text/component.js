import Component from '@ember/component';

/**
 * Reusable title component to enable consistent styling and behavior across the app.
 * Rather than using utility classes or duplicative css classes,
 * this enables consistency and a common interface for rendering titles.
 */
export default Component.extend({
  tagName: 'h2',
  classNames: ['TitleText'],
  classNameBindings: [
    'center:TitleText--center',
    'strong:TitleText--strong',
    'noMargin:TitleText--noMargin',
    'inline:TitleText--inline',
    'lighten:TitleText--lighten',
    'small:TitleText--small'
  ],

  // Public interface for styling
  // Note: be careful not to add too many params here, or we are no better than inline styles!
  center: false,
  strong: false, // "strong" not "bold", so it can evolve with time, should "strong" take a new meaning
  noMargin: false,
  inline: false,
  lighten: false,
  small: false
});

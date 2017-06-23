import TitleTextComponent from 'subtext-ui/pods/components/title-text/component';

/**
 * Reusable sub-title component to enable consistent styling and behavior across the app.
 * Rather than using utility classes or duplicative css classes,
 * this enables consistency and a common interface for rendering sub titles.
 *
 * While it may seem that this is duplicative of the `title-text` component, it enables hierarchical title and sub-title
 */
export default TitleTextComponent.extend({
  tagName: 'h3',
  classNames: ['SubTitleText'],
});

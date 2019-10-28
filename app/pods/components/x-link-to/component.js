import LinkComponent from '@ember/routing/link-component';
import XButtonMixin from 'subtext-app/mixins/components/x-button';

/**
 * Reusable button-styled `link-to` component supporting multiple button colors, sizes and styles.
 * Also see `x-button` component, for a `button` version with the same styling.
 */
export default LinkComponent.extend(XButtonMixin, {
  tagName: 'a',
  style: 'link',
  color: 'black',
  onClick(){},

  click(e) {
    e.preventDefault();
    this.onClick();
  }
});

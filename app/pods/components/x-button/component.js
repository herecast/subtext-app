import Component from '@ember/component';
import XButtonMixin from 'subtext-ui/mixins/components/x-button';


/**
 * Reusable button component supporting multiple button colors, sizes and styles.
 * Also see `x-link-to` component, for a `link-to` version with the same styling.
 */
export default Component.extend(XButtonMixin, {
  tagName: 'button',

  attributeBindings: ['type', 'disabled'],
  type: 'button',
  onClick(){},

  click(e) {
    e.preventDefault();
    this.onClick();
  }
});

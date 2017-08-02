import Ember from 'ember';
import XButtonMixin from 'subtext-ui/mixins/components/x-button';


/**
 * Reusable button component supporting multiple button colors, sizes and styles.
 * Also see `x-link-to` component, for a `link-to` version with the same styling.
 */
export default Ember.Component.extend(XButtonMixin, {
  click(e) {
    e.preventDefault();
    this.onClick();
  }
});

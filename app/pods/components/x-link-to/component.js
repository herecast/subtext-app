import Ember from 'ember';
import XButtonMixin from 'subtext-ui/mixins/components/x-button';

/**
 * Reusable button-styled `link-to` component supporting multiple button colors, sizes and styles.
 * Also see `x-button` component, for a `button` version with the same styling.
 */
export default Ember.LinkComponent.extend(XButtonMixin, {
  tagName: 'a',
  style: 'link',
  color: 'black',
});

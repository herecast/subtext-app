import Ember from 'ember';
import XButtonMixin from 'subtext-ui/mixins/components/x-button';

/**
 * Reusable anchor tag component supporting multiple button colors, sizes and styles.
 * Also see `x-link-to` component, for an Ember `link-to` version with the same styling.
 */
export default Ember.Component.extend(XButtonMixin, {
  tagName: 'a',
  attributeBindings: ['href'],
  href: null
});

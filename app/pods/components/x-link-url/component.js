import Ember from 'ember';
import XButtonMixin from 'subtext-ui/mixins/components/x-button';

const { get } = Ember;

/**
 * Reusable anchor tag component supporting multiple button colors, sizes and styles.
 * Also see `x-link-to` component, for an Ember `link-to` version with the same styling.
 */
export default Ember.Component.extend(XButtonMixin, {
  tagName: 'a',
  attributeBindings: ['href', 'target'],
  href: null,
  target: '_blank',
  onClick: false,

  click() {
    if (get(this, 'onClick')) {
      get(this, 'onClick')();
      return false;
    }
    return true;
  }
});

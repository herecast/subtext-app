import { notEmpty } from '@ember/object/computed';
import Component from '@ember/component';
import { isEmpty } from '@ember/utils';
import { get, computed } from '@ember/object';

export default Component.extend({
  classNames: ['FormGroup'],
  classNameBindings: ['hasError:has-error', 'smallMargin:FormGroup--smallMargin'],

  smallMargin: false,

  hasError: computed('error', 'errors', function() {
    return !isEmpty(get(this, 'errors')) || !isEmpty(get(this, 'error'));
  }),

  // Set in components that will render their own error message rather than the
  // help-block one provided by this component.
  hideError: false,

  // Only show the error at the bottom of the form-group component if it's
  // present and hideError is true. This allows us to control where we render
  // the error in some cases.
  displayError: computed('error', 'hideError', function() {
    return get(this, 'error') && !get(this, 'hideError');
  }),

  hasLabel: notEmpty('label'),

  uniqueID: computed(function() {
    return `field_${(new Date()).getTime()}`;
  })
});

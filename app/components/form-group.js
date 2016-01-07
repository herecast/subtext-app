import Ember from 'ember';

const {
  computed,
  get
} = Ember;

export default Ember.Component.extend({
  classNames: ['form-group'],
  classNameBindings: ['hasError:has-error'],
  hasError: Ember.computed.notEmpty('error'),

  // Set in components that will render their own error message rather than the
  // help-block one provided by this component.
  hideError: false,

  // Only show the error at the bottom of the form-group component if it's
  // present and hideError is true. This allows us to control where we render
  // the error in some cases.
  displayError: computed('error', 'hideError', function() {
    return get(this, 'error') && !get(this, 'hideError');
  })
});

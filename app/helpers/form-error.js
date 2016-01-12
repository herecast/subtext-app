import Ember from 'ember';

const { isPresent } = Ember;

export function formError(params/*, hash*/) {
  const error = params[0];

  if (isPresent(error)) {
    return Ember.String.htmlSafe(`<span class='ContentForm-error'>${error}</span>`);
  }
}

export default Ember.Helper.helper(formError);

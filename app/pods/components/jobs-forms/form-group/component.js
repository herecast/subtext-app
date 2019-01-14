import { notEmpty } from '@ember/object/computed';
import Component from '@ember/component';

export default Component.extend({
  classNames: ['JobsForms-FormGroup'],
  classNameBindings: ['hasError:has-formerror'],

  error: null,

  hasError: notEmpty('error')
});

import Ember from 'ember';
import ContentValidations from 'subtext-ui/validations/content';
import {
  validateFormat
} from 'ember-changeset-validations/validators';

const {
  assign,
  isPresent
} = Ember;

export default assign({}, ContentValidations, {
  contactEmail: [
    validateFormat({
      type: 'email',
      allowBlank: true
    }),

    function(key, newValue, oldValue, changes, model) {
      const keys = ['contactEmail', 'contactPhone'];

      const netAttrs = assign({},
        model.getProperties(keys),
        changes
      );

      if(!keys.any((key) => isPresent(netAttrs[key]))) {
        return "required if not adding a contact phone number";
      } else {
        return true;
      }
    }
  ],

  contactPhone: [
    validateFormat({
      type: 'phone',
      allowBlank: true
    }),

    function(key, newValue, oldValue, changes, model) {
      const keys = ['contactEmail', 'contactPhone'];
      const netAttrs = assign({},
        model.getProperties(keys),
        changes
      );

      if(!keys.any((key) => isPresent(netAttrs[key]))) {
        return "required if not adding a contact email";
      } else {
        return true;
      }
    }
  ],
});

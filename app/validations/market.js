import { assign } from '@ember/polyfills';
import { isPresent } from '@ember/utils';
import ContentValidations from 'subtext-ui/validations/content';
import {
  validateFormat
} from 'ember-changeset-validations/validators';

export default assign({}, ContentValidations, {
  contactEmail: [
    validateFormat({
      type: 'email',
      allowBlank: true
    }),

    function(key, newValue, oldValue, changes, model) {
      if(!isPresent(newValue)) {
        const keys = ['contactPhone'];

        const netAttrs = assign({},
          model.getProperties(keys),
          changes
        );


        if(!keys.any((key) => isPresent(netAttrs[key]))) {
          return "required if not adding a contact phone number";
        }
      }

      return true;
    }
  ],

  contactPhone: [
    validateFormat({
      type: 'phone',
      allowBlank: true
    }),

    function(key, newValue, oldValue, changes, model) {
      if(!isPresent(newValue)) {
        const keys = ['contactEmail'];
        const netAttrs = assign({},
          model.getProperties(keys),
          changes
        );

        if(!keys.any((key) => isPresent(netAttrs[key]))) {
          return "required if not adding a contact email";
        }
      } 

      return true;
    }
  ],
});

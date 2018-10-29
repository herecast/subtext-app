import { assign } from '@ember/polyfills';
import { isPresent } from '@ember/utils';
import ContentValidations from 'subtext-ui/validations/content';
import {
  validateFormat
} from 'ember-changeset-validations/validators';

export default assign({}, ContentValidations, {
  schedules(key, newValue) {
    return newValue.rejectBy('_remove').length > 0 || "must have at least one valid date";
  },

  venueId(key, newValue, oldValue, changes, event) {
    if(!isPresent(newValue)) {
      const requiredAttrs = [
        'venueAddress',
        'venueCity',
        'venueState',
        'venueZip'
      ];

      const netAttrs = assign({},
        event.getProperties(requiredAttrs),
        changes
      );

      if(!requiredAttrs.every((attr) => isPresent(netAttrs[attr]))) {
        return "A venue is required";
      }

    }

    return true;
  },

  contactEmail: [
    validateFormat({
      type: 'email',
      allowBlank: true
    })
  ],

  contactPhone: [
    validateFormat({
      type: 'phone',
      allowBlank: true
    })
  ],

  eventUrl: [
    validateFormat({
      type: 'url',
      allowBlank: true
    })
  ],
});

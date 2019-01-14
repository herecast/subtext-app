import { get, getProperties, computed } from '@ember/object';
import { notEmpty } from '@ember/object/computed';
import { isBlank, isPresent } from '@ember/utils';
import Component from '@ember/component';

export default Component.extend({
  classNames: ['JobsForms-Metadata'],

  model: null,

  onChange: function() {},

  maxlengthCost: 50,
  maxlengthUrl: 140,

  costAtMaxLength: computed('model.cost', function() {
    const cost = get(this, 'model.cost') || '';
    return cost.length >= get(this, 'maxlengthCost');
  }),

  urlAtMaxLength: computed('model.url', function() {
    const url = get(this, 'model.url') || '';
    return url.length >= get(this, 'maxlengthUrl');
  }),

  contactInfoIsBlank: computed('model.{contactPhone,contactEmail}', function() {
    const model = get(this, 'model');
    const { contactPhone, contactEmail } = getProperties(model, ['contactPhone', 'contactEmail']);

    return isBlank(contactPhone) && isBlank(contactEmail);
  }),

  errorPossibleEmail: computed('model.contactEmail', 'contactInfoIsBlank', function() {
    const contactInfoIsBlank = get(this, 'contactInfoIsBlank');
    const contactEmail = get(this, 'model.contactEmail');

    return contactInfoIsBlank || isPresent(contactEmail);

  }),

  errorPossiblePhone: computed('model.contactPhone', 'contactInfoIsBlank', function() {
    const contactInfoIsBlank = get(this, 'contactInfoIsBlank');
    const contactPhone = get(this, 'model.contactPhone');

    return contactInfoIsBlank || isPresent(contactPhone);
  }),

  errorPossibleUrl: notEmpty('model.url'),

  actions: {
    inputChanging(property) {
      this.onChange(property);
    }
  }
});

import Ember from 'ember';

export default Ember.Mixin.create({
  errors: {},

  validatePresenceOf(attr) {
    const value = this.get(attr);
    const attrName = Ember.A(attr.split('.')).get('lastObject');

    if (Ember.isPresent(value)) {
      this.set(`errors.${attrName}`, null);
      delete this.get('errors')[attrName];
    } else {
      this.set(`errors.${attrName}`, 'Cannot be blank');
    }
  },

  hasValidEmail(email) {
    // From https://html.spec.whatwg.org/multipage/forms.html#valid-e-mail-address
    // Retrieved 2014-01-14
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

    return Ember.isBlank(email) || emailRegex.test(email);
  },

  hasValidPhone(phone) {
    const requiredDigits = 10;
    const actualDigits = phone.replace(/[^0-9]/g,"").length;

    return Ember.isBlank(phone) || requiredDigits === actualDigits;
  }
});

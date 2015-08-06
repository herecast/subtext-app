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
  }
});

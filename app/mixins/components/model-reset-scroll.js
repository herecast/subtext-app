import Ember from 'ember';

export default Ember.Mixin.create({
  didUpdateAttrs(attrs) {
    this._super(...arguments);
    if (attrs.newAttrs.model.value !== attrs.oldAttrs.model.value) {
      this.scrollTo(0);
    }
  }
});

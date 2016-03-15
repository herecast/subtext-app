import Ember from 'ember';

export default Ember.Component.extend({
  tagName: 'input',
  attributeBindings: ['type', 'accept'],
  accept: ".jpg,.jpeg,.png",
  type: 'file',

  change() {
    const file = this.$().context.files[0];

    this.attrs.addImage(file);
  }
});

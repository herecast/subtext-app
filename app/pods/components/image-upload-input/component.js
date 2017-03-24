import Ember from 'ember';

const { get } = Ember;

export default Ember.Component.extend({
  tagName: 'input',
  attributeBindings: ['type', 'accept'],
  accept: ".jpg,.jpeg,.png",
  type: 'file',

  change() {
    const file = this.$().context.files[0];

    get(this, 'addImage')(file);
  }
});

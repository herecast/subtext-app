import Ember from 'ember';

const { set, get } = Ember;

export default Ember.Component.extend({
  input: null,

  didInsertElement() {
    const input = this.$('input');

    set(this, 'input', input);
  },

  click() {
    get(this, 'input').select();
  }
});

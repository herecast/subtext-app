import Ember from 'ember';

const { get } = Ember;

export default Ember.Component.extend({
  tagName: 'form',
  actions: {
    save() {
      if(this.attrs.didSave) {
        this.attrs.didSave(get(this, 'model'));
      }
    }
  }
});

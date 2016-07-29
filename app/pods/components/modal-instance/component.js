import Ember from 'ember';

export default Ember.Component.extend({
  context: null,

  keyUp(e) {
    if (e.keyCode === 27) {
      this.close();
    }
  },

  ok() {
    if ('onOk' in this.attrs) {
      this.attrs.onOk(...arguments);
    }
  },

  cancel() {
    if ('onCancel' in this.attrs) {
      this.attrs.onCancel(...arguments);
    }
  },

  close() {
    this.cancel(...arguments);
  },

  actions: {
    close() {
      this.close();
    },
    cancel() {
      this.cancel(...arguments);
    },
    ok(){
      this.ok(...arguments);
    },
  }
});

import Ember from 'ember';

const { get } = Ember;

export default Ember.Component.extend({
  context: null,

  keyUp(e) {
    if (e.keyCode === 27) {
      this.close();
    }
  },

  ok() {
    const onOk = get(this, 'onOk');
    if (onOk) {
      onOk(...arguments);
    }
  },

  cancel() {
    const onCancel = get(this, 'onCancel');
    if (onCancel) {
      onCancel(...arguments);
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

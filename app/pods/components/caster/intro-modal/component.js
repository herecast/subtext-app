import { get } from '@ember/object';
import Component from '@ember/component';

export default Component.extend({
  classNames: ['Caster-IntroModal'],

  actions: {
    closeModal() {
      if (get(this, 'onClose')) {
        get(this, 'onClose')();
      }
    }
  }
});

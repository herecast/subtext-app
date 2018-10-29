import Component from '@ember/component';
import { set } from '@ember/object';

export default Component.extend({

  init() {
    this._super(...arguments);

    let fakeCards = [];

    for (var i=0; i<=5; i++) {
      fakeCards.push({});
    }

    set(this, 'fakeCards', fakeCards);
  }
});

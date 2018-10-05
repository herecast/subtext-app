import Ember from 'ember';

const { set } = Ember;

export default Ember.Component.extend({

  init() {
    this._super(...arguments);

    let fakeCards = [];

    for (var i=0; i<=5; i++) {
      fakeCards.push({});
    }

    set(this, 'fakeCards', fakeCards);
  }
});

import { get, set } from '@ember/object';
import { readOnly, equal } from '@ember/object/computed';
import { inject as service } from '@ember/service';
import Component from '@ember/component';

export default Component.extend({
  session: service(),

  activeCardSize: readOnly('session.cardSize'),
  showMidsizeCards: equal('activeCardSize', 'midsize'),
  showCompactCards: equal('activeCardSize', 'compact'),

  init() {
    this._super(...arguments);

    const activeCardSize = get(this, 'activeCardSize');

    let fakeCards = [];
    let numberOfCards = 5;

    if (activeCardSize === 'midsize') {
      numberOfCards = 10;
    }

    if (activeCardSize === 'compact') {
      numberOfCards = 20;
    }


    for (var i=0; i<=numberOfCards; i++) {
      fakeCards.push({});
    }

    set(this, 'fakeCards', fakeCards);
  }
});

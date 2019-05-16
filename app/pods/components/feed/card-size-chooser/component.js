import { get } from '@ember/object';
import { readOnly } from '@ember/object/computed';
import { inject as service } from '@ember/service';
import Component from '@ember/component';

export default Component.extend({
  classNames: ['Feed-CardSizeChooser'],

  session: service(),

  activeCardSize: readOnly('session.cardSize'),

  actions: {
    switchCardSize(cardSize) {
      get(this, 'session').switchCardSize(cardSize);
    }
  }
});

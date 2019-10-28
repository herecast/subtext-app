import { get } from '@ember/object';
import { inject as service } from '@ember/service';
import Mixin from '@ember/object/mixin';

export default Mixin.create({
  floatingActionButton: service(),

  init() {
    this._super(...arguments);
    get(this, 'floatingActionButton')
    .on('closeShowModals', (returnPath = null) => {
      this._closeModal(returnPath);
    });
  },

  _closeModal(parentRoute) {
    this.transitionToRoute(parentRoute);
    this.send('closeModalRoute');
  },

  actions: {
    closeModal(parentRoute) {
      this._closeModal(parentRoute);
    }
  }
});

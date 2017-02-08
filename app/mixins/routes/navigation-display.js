import Ember from 'ember';

const {get} = Ember;

export default Ember.Mixin.create({

  actions: {
    didTransition() {
      const hideHeader = get(this, 'hideHeader') || false;
      const hideFooter = get(this, 'hideFooter') || false;

      this.controllerFor('application').setProperties({
        hideHeader: hideHeader,
        hideFooter: hideFooter
      });
      return this._super(...arguments); //bubble
    },

    willTransition() {
      this.controllerFor('application').setProperties({
        hideHeader: false,
        hideFooter: false
      });
      return this._super(...arguments); //bubble
    }
  }


});

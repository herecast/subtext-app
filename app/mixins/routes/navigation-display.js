import Mixin from '@ember/object/mixin';
import { get } from '@ember/object';

export default Mixin.create({

  actions: {
    didTransition() {
      const hideHeader = get(this, 'hideHeader') || false;
      const hideFooter = get(this, 'hideFooter') || false;
      const streamlinedHeader = get(this, 'streamlinedHeader') || false;

      this.controllerFor('application').setProperties({
        hideHeader: hideHeader,
        hideFooter: hideFooter,
        streamlinedHeader: streamlinedHeader
      });
      return this._super(...arguments); //bubble
    },

    willTransition() {
      this.controllerFor('application').setProperties({
        hideHeader: false,
        hideFooter: false,
        streamlinedHeader: false
      });
      return this._super(...arguments); //bubble
    }
  }
});

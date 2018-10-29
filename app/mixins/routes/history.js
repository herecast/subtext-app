import { inject as service } from '@ember/service';
import Mixin from '@ember/object/mixin';

export default Mixin.create({
  history: service('history'),
  routeModel: null,

  actions: {
    didTransition: function() {
      this._super(...arguments);
      const routeName = this.get('historyRouteName') || this.routeName;
      this.get('history').setRouteName(routeName);
      this.get('history').setRouteModel(this.get('historyRouteModel'));
      
      return true;
    }
  }
});

import { get } from '@ember/object';
import { inject as service } from '@ember/service';
import Mixin from '@ember/object/mixin';

export default Mixin.create({
  routing: service('-routing'),
  router: service(),

  _clearOutlet() {
    this.disconnectOutlet({
      outlet: 'modal-outlet',
      parentView: 'application'
    });

    const routingRouter = get(this, 'routing.router');
    const routerLib = routingRouter._routerMicrolib || routingRouter.router;
    const url = get(this, 'router').urlFor(this.routeName);

    routerLib.updateURL(url);
  },

  actions: {
    closeModalRoute() {
      this._clearOutlet();
    }
  }
});

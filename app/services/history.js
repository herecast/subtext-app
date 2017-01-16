import Ember from 'ember';
const { get, set, run, inject } = Ember;

export default Ember.Service.extend({
  windowService: inject.service('window-location'),
  fastboot: inject.service(),
  routeName: null,
  routeModel: null,
  referrer: "",
  current: null,

  setRouteName(name) {
    set(this, 'routeName', name);
  },
  setRouteModel(model) {
    set(this, 'routeModel', model);
  },
  update() {
    const windowService = get(this, 'windowService');
    if(get(this, 'current')) {
      set(this, 'referrer', get(this, 'current'));
    } else {
      set(this, 'referrer', windowService.referrer());
    }
    run.next(()=>{
      const href = windowService.href();
      set(this, 'current', href);
    });
  }
});

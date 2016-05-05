import Ember from 'ember';
const { get, set, run } = Ember;

export default Ember.Service.extend({
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
    if(get(this, 'current')) {
      set(this, 'referrer', get(this, 'current'));
    } else {
      set(this, 'referrer', document.referrer);
    }
    run.next(()=>{
      set(this, 'current', window.location.href);
    });
  }
});

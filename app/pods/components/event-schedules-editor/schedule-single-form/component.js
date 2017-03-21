import Ember from 'ember';

let {
  get,
  getWithDefault,
  set
} = Ember;

export default Ember.Component.extend({
  changeset: null,

  init() {
    this._super(...arguments);

    const schedule = get(this, 'changeset');

    set(schedule, 'startTime',
      getWithDefault(schedule, 'startTime', '09:00 am')
    );
  }

});

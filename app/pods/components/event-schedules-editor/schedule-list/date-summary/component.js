import Ember from 'ember';

const {
  get,
  on
} = Ember;

export default Ember.Component.extend({
  classNames: ['Event-schedule-summary u-layoutPadB10'],

  scheduleSummary: null,

  animateIn: on('didInsertElement', function() {
    this.$()
      .hide()
      .slideDown(300);
  }),

  animateOut: on('willDestroyElement', function() {
    // TODO animate destroy
  }),

  actions: {
    remove: function() {
      const schedule = get(this, 'schedule');

      get(this, 'remove')(schedule);
    },

    edit() {
      const schedule = get(this, 'schedule');

      get(this, 'edit')(schedule);
    }
  }
});

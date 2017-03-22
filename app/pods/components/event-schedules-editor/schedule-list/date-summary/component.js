import Ember from 'ember';

const {
  get
} = Ember;

export default Ember.Component.extend({
  classNames: ['Event-schedule-summary u-layoutPadB10'],

  scheduleSummary: null,

  didInsertElement() {
    this._super(...arguments);

    this.animateIn();
  },

  animateIn() {
    this.$()
      .hide()
      .slideDown(300);
  },

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

import DateSummary from '../date-summary/component';

export default DateSummary.extend({
  init() {
    this._super(...arguments);
    this.set('isEditing', false);
  },

  actions: {
    edit() {
      this.set('isEditing', true);
    },

    hideModal() {
      this.resetProperties();
    }
  }
});

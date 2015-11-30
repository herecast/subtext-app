import DateSummary from '../date-summary/component';

export default DateSummary.extend({
  schedule: null,

  init() {
    this._super(...arguments);
    this.resetProperties();
  },

  resetProperties() {
    this.setProperties({
      isManaging: false,
      isEditing: false
    });
  },

  actions: {
    edit() {
      this.setProperties({
        isManaging: false,
        isEditing: true
      });
    },

    manage() {
      this.setProperties({
        isManaging: true,
        isEditing: false
      });
    },

    hideModal() {
      this.resetProperties();
    }
  }
});

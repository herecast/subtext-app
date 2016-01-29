import Ember from 'ember';
import TrackEvent from 'subtext-ui/mixins/track-event';

export default Ember.Component.extend(TrackEvent, {
  isSaving: false,

  editLink: function() {
    if (this.get('model.isNew')) {
      return 'events.new.promotion';
    } else {
      return 'events.edit.promotion';
    }
  }.property('model.isNew'),

  _getTrackingArguments() {
    return {
      navControlGroup: 'Submit Content',
      navControl: 'Submit Event'
    };
  },

  actions: {
    save(callback) {
      this.set('isSaving', true);

      const event = this.get('model');
      const promise = event.save();

      callback(promise);

      promise.then((savedEvent) => {
        savedEvent.get('schedules').filterBy('isNew').forEach((schedule) => {
          schedule.destroyRecord();
        });

        if (savedEvent.get('image')) {
          savedEvent.uploadImage().then(() => {
            this.set('isSaving', false);
            this.sendAction('afterPublish', savedEvent);
          });
        } else {
          this.set('isSaving', false);
          this.sendAction('afterPublish', savedEvent);
        }
      });
    }
  }
});

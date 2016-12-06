import Ember from 'ember';
import TrackEvent from 'subtext-ui/mixins/track-event';

const { computed } = Ember;

export default Ember.Component.extend(TrackEvent, {
  isSaving: false,
  callToAction: 'Save & Publish',

  editLink: computed('model.isNew', function() {
    if (this.get('model.isNew')) {
      return 'events.new.promotion';
    } else {
      return 'events.edit.promotion';
    }
  }),

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
        this.sendAction('afterPublish', savedEvent);
      }).finally(()=>{
        this.set('isSaving', false);
      });
    }
  }
});

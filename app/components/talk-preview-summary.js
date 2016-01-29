import Ember from 'ember';
import TrackEvent from 'subtext-ui/mixins/track-event';

export default Ember.Component.extend(TrackEvent, {
  isSaving: false,

  editLink: function() {
    if (this.get('model.isNew')) {
      return 'talk.new.promotion';
    } else {
      return 'talk.edit.promotion';
    }
  }.property('model.isNew'),

  _getTrackingArguments() {
    return {
      navControlGroup: 'Submit Content',
      navControl: 'Submit Talk'
    };
  },

  actions: {
    save(callback) {
      this.set('isSaving', true);

      const talk = this.get('model');
      const promise = talk.save();

      callback(promise);

      promise.then((savedTalk) => {
        if (savedTalk.get('image')) {
          savedTalk.uploadImage().then(() => {
            this.set('isSaving', false);
            this.sendAction('afterPublish', savedTalk);
          });
        } else {
          this.set('isSaving', false);
          this.sendAction('afterPublish', savedTalk);
        }
      });
    }
  }
});

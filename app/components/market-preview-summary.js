import Ember from 'ember';
import TrackEvent from 'subtext-ui/mixins/track-event';

const {
  set
} = Ember;

export default Ember.Component.extend(TrackEvent, {
  isSaving: false,

  editLink: function() {
    if (this.get('model.isNew')) {
      return 'market.new.promotion';
    } else {
      return 'market.edit.promotion';
    }
  }.property('model.isNew'),

  _getTrackingArguments() {
    return {
      navControlGroup: 'Submit Content',
      navControl: 'Submit Market Listing'
    };
  },

  actions: {
    save(callback) {
      this.set('isSaving', true);

      const post = this.get('model');
      const promise = post.saveWithImages();

      callback(promise);

      promise.then(() => {
        set(this, 'isSaving', false);
        this.sendAction('afterPublish', post);
      });
    }
  }
});

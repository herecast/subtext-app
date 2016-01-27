import Ember from 'ember';
import TrackEvent from 'subtext-ui/mixins/track-event';

const {
  get
} = Ember;

export default Ember.Mixin.create(TrackEvent, {
  actions: {
    trackClick(content) {
      const modelName = content.get('constructor.modelName');
      let publishedAt = get(content, 'publishedAt');

      if (publishedAt) {
        publishedAt = publishedAt.toString();
      }

      if (modelName === 'talk' && get(content, 'hasParentContent')) {
        // When clicking on a comment for something other than a talk, we don't
        // have access to the pub date or the organization name because it hasn't
        // been loaded yet.
        this.trackEvent('selectContent', {
          contentID: get(content, 'parentContentId'),
          contentChannel: get(content, 'parentContentType'),
          contentTitle: get(content, 'title')
        });
      } else {
        this.trackEvent('selectContent', {
          contentID: get(content, 'id'),
          contentChannel: modelName,
          contentPubdate: publishedAt,
          contentTitle: get(content, 'title'),

          // Only available for news
          contentOrganization: get(content, 'organizationName')
        });
      }

    }
  }
});

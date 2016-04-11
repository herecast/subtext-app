import Ember from 'ember';
import ExpandableContent from '../mixins/components/expandable-content';

const { get, inject } = Ember;

const { on } = Ember;

export default Ember.Component.extend(ExpandableContent, {
  classNames:[ 'SimilarContent'],
  
  contentModel: Ember.inject.service('content-model'),
  api: inject.service('api'),

  getSimilarContent: on('init', function() {
    const contentId = this.get('contentId');
    const api = get(this, 'api');

    if (contentId) {
      api.getSimilarContent(contentId).then((response) => {
        const contentModel = this.get('contentModel');

        // Filter out any events that do not have a start date. These are events
        // that have been imported and do not have event instances associated
        // with them.
       const contents = response.similar_content.reject((record) => {
          return record.content_type === 'event' && Ember.isBlank(record.starts_at);
        }).map((record) => {
          return contentModel.convert(record);
        });

        this.set('content', contents);
        this.set('sourceContentId', contentId);
      });
    }
  })
});

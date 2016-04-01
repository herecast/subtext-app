import Ember from 'ember';
import ExpandableContent from '../mixins/components/expandable-content';
import ajax from 'ic-ajax';
import config from '../config/environment';

export default Ember.Component.extend(ExpandableContent, {
  contentModel: Ember.inject.service('content-model'),

  getSimilarContent: function() {
    const contentId = this.get('contentId');

    if (contentId) {
      const url = `${config.API_NAMESPACE}/contents/${contentId}/similar_content`;

      ajax(url).then((response) => {
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
  }.on('init')
});

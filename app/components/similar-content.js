import Ember from 'ember';
import ExpandableContent from '../mixins/components/expandable-content';
import {chunk} from 'lodash';

const { get, set, computed, inject, on, isPresent } = Ember;

export default Ember.Component.extend(ExpandableContent, {
  classNames:[ 'SimilarContent'],

  contentModel: Ember.inject.service('content-model'),
  api: inject.service('api'),
  fastboot: inject.service('fastboot'),
  content: null,

  getSimilarContent: on('init', function() {
    set(this, 'content', []);

    if(!get(this, 'fastboot.isFastBoot')) {
      const contentId = this.get('contentId');
      const api = get(this, 'api');

      if (contentId) {
        api.getSimilarContent(contentId).then(({similar_content}) => {
          if(isPresent(similar_content)) {
            const contentModel = this.get('contentModel');


            // Filter out any events that do not have a start date. These are events
            // that have been imported and do not have event instances associated
            // with them.
            const contents = similar_content.filter((record) => {
              return !(record.content_type === 'event' && Ember.isBlank(record.starts_at));
            }).map((record) => {
              return contentModel.convert(record);
            });

            this.set('content', contents);
            this.set('sourceContentId', contentId);
          }
        });
      }
    }
  }),

  /**
   * Group the content into rows of two items per row
   */
  groupedContent: computed('contentToDisplay.[]', function() {
    const contentToDisplay = get(this, 'contentToDisplay');
    return chunk(contentToDisplay, 2);
  })
});

import Ember from 'ember';
import ExpandableContent from '../mixins/components/expandable-content';
import FastbootExtensions from 'subtext-ui/mixins/fastboot-extensions';
import {chunk} from 'lodash';

const { get, computed, inject, on, isPresent } = Ember;

export default Ember.Component.extend(ExpandableContent, FastbootExtensions, {
  classNames:[ 'SimilarContent'],

  contentModel: Ember.inject.service('content-model'),
  api: inject.service('api'),

  getSimilarContent: on('init', function() {
    const contentId = this.get('contentId');
    const api = get(this, 'api');

    if (contentId) {
      const promise = api.getSimilarContent(contentId).then(({similar_content}) => {
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

      // ensure fastboot waits for promise before rendering
      this.deferRenderingIfFastboot(promise);
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

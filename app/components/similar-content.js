import Ember from 'ember';
import {chunk} from 'lodash';

const { get, set, computed, inject, on, isPresent } = Ember;

export default Ember.Component.extend({
  classNames:[ 'SimilarContent'],
  api: inject.service('api'),
  fastboot: inject.service('fastboot'),
  store: inject.service(),
  content: null,

  getSimilarContent: on('init', function() {
    set(this, 'content', []);

    if(!get(this, 'fastboot.isFastBoot')) {
      const contentId = this.get('contentId');
      const api = get(this, 'api');

      if (contentId) {
        api.getSimilarContent(contentId).then((payload) => {
          if(isPresent(payload.similar_content) && payload.similar_content.length) {
            payload.contents = payload.similar_content;
            delete payload.similar_content;

            const similarContentIds = payload.contents.map(content => content.id);

            get(this, 'store').pushPayload('content', payload);

            let similarContents = [];

            similarContentIds.forEach((similarContentId) => {
              similarContents.push(get(this, 'store').peekRecord('content', similarContentId));
            });

            this.set('content', similarContents);
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

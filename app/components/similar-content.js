import Ember from 'ember';
import ExpandableContent from '../mixins/components/expandable-content';
import {chunk} from 'lodash';

const { get, set, computed, inject, on, isPresent } = Ember;

export default Ember.Component.extend(ExpandableContent, {
  classNames:[ 'SimilarContent'],
  api: inject.service('api'),
  fastboot: inject.service('fastboot'),
  content: null,

  getSimilarContent: on('init', function() {
    set(this, 'content', []);

    if(!get(this, 'fastboot.isFastBoot')) {
      const contentId = this.get('contentId');
      const api = get(this, 'api');

      if (contentId) {
        api.getSimilarContent(contentId).then(({similarContent}) => {
          if(isPresent(similarContent)) {
            this.set('content', similarContent);
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

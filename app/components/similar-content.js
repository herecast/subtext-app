import { inject as service } from '@ember/service';
import Component from '@ember/component';
import { computed, set, get } from '@ember/object';
import { isPresent } from '@ember/utils';

export default Component.extend({
  classNames:[ 'SimilarContent'],
  api: service('api'),
  fastboot: service('fastboot'),
  store: service(),
  content: null,
  limit: 4,

  init() {
    this._super(...arguments);

    set(this, 'content', []);

    if(!get(this, 'fastboot.isFastBoot')) {
      const contentId = this.get('contentId');
      const api = get(this, 'api');

      if (contentId) {
        api.getSimilarContent(contentId).then((payload) => {
          if (isPresent(payload.similar_content) && payload.similar_content.length) {
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
  },

  contentToDisplay: computed('content.[]', function() {
    const content = get(this, 'content');

    return content.slice(0, get(this, 'limit'));
  })
});

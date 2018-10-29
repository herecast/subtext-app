import { notEmpty, gt, alias, reads } from '@ember/object/computed';
import Component from '@ember/component';
import { computed, get } from '@ember/object';
import { isPresent } from '@ember/utils';
import { htmlSafe } from '@ember/template';
import { optimizedImageUrl } from 'subtext-ui/helpers/optimized-image-url';
import textSnippet from 'subtext-ui/mixins/components/text-snippet';

export default Component.extend(textSnippet, {
  classNames: 'FeedCard-Image',

  model: null,
  linkUrl: null,
  eventInstanceId: null,
  linkToDetailIsActive: true,
  onContentClick() {},

  maxSnippetLength: 160,

  hasImage: notEmpty('imageUrl'),
  hasExcerpt: gt('textSnippet.length', 10),
  excerpt: computed('textSnippet', function() {
    return htmlSafe(get(this, 'textSnippet'));
  }),
  showContinueReading: alias('isSnipped'),
  contentType: reads('model.contentType'),

  imageStyle: computed('imageUrl', function() {
    const imageUrl = get(this, 'imageUrl');
    const options = [imageUrl, 500, 300, true];

    if (isPresent(imageUrl)) {
      return htmlSafe(`background-image: url('${optimizedImageUrl(options)}');`);
    }

    return '';
  })
});

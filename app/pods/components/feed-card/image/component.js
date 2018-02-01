import Ember from 'ember';
import { optimizedImageUrl } from 'subtext-ui/helpers/optimized-image-url';
import textSnippet from 'subtext-ui/mixins/components/text-snippet';

const { get, computed, isPresent, String:{htmlSafe} } = Ember;

export default Ember.Component.extend(textSnippet, {
  classNames: 'FeedCard-Image',

  model: null,
  linkUrl: null,
  eventInstanceId: null,
  linkToDetailIsActive: true,
  onContentClick() {},

  maxSnippetLength: 160,

  hasImage: computed.notEmpty('imageUrl'),
  hasExcerpt: computed.gt('textSnippet.length', 10),
  excerpt: computed.alias('textSnippet'),
  showContinueReading: computed.alias('isSnipped'),
  contentType: computed.reads('model.normalizedContentType'),

  imageStyle: computed('imageUrl', function() {
    const imageUrl = get(this, 'imageUrl');
    const options = [imageUrl, 500, 300, true];

    if (isPresent(imageUrl)) {
      return htmlSafe(`background-image: url('${optimizedImageUrl(options)}');`);
    }

    return '';
  })
});

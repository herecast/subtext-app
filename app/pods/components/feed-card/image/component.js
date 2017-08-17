import Ember from 'ember';
import { optimizedImageUrl } from 'subtext-ui/helpers/optimized-image-url';

const { get, computed, isPresent, String:{htmlSafe} } = Ember;

export default Ember.Component.extend({
  classNames: 'FeedCard-Image',

  eventInstanceId: null,

  hasImage: computed.notEmpty('imageUrl'),
  hasCaption: computed.notEmpty('caption'),

  imageStyle: computed('imageUrl', function() {
    const imageUrl = get(this, 'imageUrl');
    const options = [imageUrl, 500, 300, true];

    if (isPresent(imageUrl)) {
      return htmlSafe(`background-image: url('${optimizedImageUrl(options)}');`);
    }

    return '';
  })
});

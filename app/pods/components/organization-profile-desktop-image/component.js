import Ember from 'ember';
import { optimizedImageUrl } from 'subtext-ui/helpers/optimized-image-url';

const { get, computed, String:{htmlSafe} } = Ember;

export default Ember.Component.extend({
  classNames: ['OrganizationProfileDesktopImage'],

  imageUrl: null,

  showImage: computed.notEmpty('imageUrl'),

  imageStyle: computed('imageUrl', function() {
    const imageUrl = get(this, 'imageUrl');

    if (imageUrl) {
      const options = [imageUrl, 1280, 720, false];

      return htmlSafe(`background-image: url('${optimizedImageUrl(options)}');`);
    }

    return '';
  })
});

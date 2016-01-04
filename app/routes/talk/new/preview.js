import Ember from 'ember';
import Track from '../../../mixins/routes/track-pageview';
import DocTitleFromContent from '../../../mixins/routes/title-token-from-content';

export default Ember.Route.extend(Track, DocTitleFromContent, {
  additionalToken: 'Preview'
});

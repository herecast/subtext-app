import Ember from 'ember';
import Listservs from '../../../mixins/routes/listservs';
import Track from '../../../mixins/routes/track-pageview';
import DocTitleFromContent from '../../../mixins/routes/title-token-from-content';

export default Ember.Route.extend(Listservs, Track, DocTitleFromContent, {
  additionalToken: 'Promote'
});

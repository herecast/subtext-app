import Ember from 'ember';
import Listservs from '../../../mixins/routes/listservs';
import DocTitleFromContent from '../../../mixins/routes/title-token-from-content';

export default Ember.Route.extend(Listservs, DocTitleFromContent, {
  additionalToken: 'Edit promotions -'
});

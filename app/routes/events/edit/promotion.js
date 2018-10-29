import Route from '@ember/routing/route';
import Listservs from '../../../mixins/routes/listservs';
import DocTitleFromContent from '../../../mixins/routes/title-token-from-content';

export default Route.extend(Listservs, DocTitleFromContent, {
  additionalToken: 'Edit promotions -'
});

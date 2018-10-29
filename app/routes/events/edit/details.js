import Route from '@ember/routing/route';
import DocTitleFromContent from '../../../mixins/routes/title-token-from-content';

export default Route.extend(DocTitleFromContent, {
  additionalToken: 'Edit'
});

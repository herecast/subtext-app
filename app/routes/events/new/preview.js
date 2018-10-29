import Route from '@ember/routing/route';
import DocTitleFromContent from '../../../mixins/routes/title-token-from-content';
import alertIfReversePublish from 'subtext-ui/mixins/routes/alert-if-reverse-publish';

export default Route.extend(DocTitleFromContent, alertIfReversePublish, {
  additionalToken: 'Preview'
});

import Ember from 'ember';
import DocTitleFromContent from '../../../mixins/routes/title-token-from-content';
import alertIfReversePublish from 'subtext-ui/mixins/routes/alert-if-reverse-publish';

export default Ember.Route.extend(DocTitleFromContent, alertIfReversePublish, {
  additionalToken: 'Preview'
});

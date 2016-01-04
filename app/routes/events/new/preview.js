import Ember from 'ember';
import DocTitleFromContent from '../../../mixins/routes/title-token-from-content';

export default Ember.Route.extend(DocTitleFromContent, {
  additionalToken: 'Preview'
});

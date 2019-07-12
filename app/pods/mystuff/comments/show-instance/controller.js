import DetailController from 'subtext-app/mixins/controllers/detail-controller';
import Controller from '@ember/controller';

export default Controller.extend(DetailController, {
  _defaultReturnPath: 'mystuff.comments.index',
  _useBasicSlideMessage: true
});

import DetailController from 'subtext-app/mixins/controllers/detail-controller';
import Controller from '@ember/controller';

export default Controller.extend(DetailController, {
  _defaultReturnPath: 'mystuff.contents.index',
  _useBasicSlideMessage: true
});

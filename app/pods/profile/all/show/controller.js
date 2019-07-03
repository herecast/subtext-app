import DetailController from 'subtext-app/mixins/controllers/detail-controller';
import Controller from '@ember/controller';

export default Controller.extend(DetailController, {
  _defaultReturnPath: 'profile.all',
  _useOrgSlideMessage: true
});

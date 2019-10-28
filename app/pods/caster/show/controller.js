import DetailController from 'subtext-app/mixins/controllers/detail-controller';
import ModalController from 'subtext-app/mixins/controllers/modal-controller';
import Controller from '@ember/controller';

export default Controller.extend(DetailController, ModalController, {
  _defaultReturnPath: 'caster.index',
  _useCasterSlideMessage: true
});

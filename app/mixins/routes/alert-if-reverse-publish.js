import { inject as service } from '@ember/service';
import Mixin from '@ember/object/mixin';
import { isPresent } from '@ember/utils';
import { run } from '@ember/runloop';

export default Mixin.create({
  modals: service(),
  warnAboutMultipleReversePublish() {
    this.get('modals').showModal('modals/alert-reverse-publish');
  },
  actions: {
    didTransition() {
      const model = this.controller.get('model');
      if(isPresent(model.get('listservIds'))) {
        run.next(() => {
          this.warnAboutMultipleReversePublish();
        });
      }
      return true;
    }
  }
});

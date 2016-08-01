import Ember from 'ember';

const { isPresent, run, inject } = Ember;

export default Ember.Mixin.create({
  modals: inject.service(),
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

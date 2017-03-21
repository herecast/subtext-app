import Ember from 'ember';
import moment from 'moment';

const { get, set, inject } = Ember;

export default Ember.Controller.extend({
  api: inject.service(),

  actions: {
    confirm() {
      const model = get(this, 'model');
      const api = get(this, 'api');

      api.confirmListservPost(model.id).then(()=> {
        api.updateListservProgress(model.id, {
          'enhance_link_clicked': false,
          'step_reached': 'verify_post'
        });

        set(model, 'verifiedAt', moment());
      });
    }
  }
});

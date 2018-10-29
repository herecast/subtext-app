import { inject as service } from '@ember/service';
import Mixin from '@ember/object/mixin';
import { get } from '@ember/object';

export default Mixin.create({
  notify: service('notification-messages'),
  api: service(),

  afterModel(model) {
    this._super(...arguments);

    //NOTE: Should modify back end to work better with this, knowing that we don't need an array, just one at a time.
    //Will also need to update the api call
    return get(this, 'api').getContentPermissions(get(model, 'contentId')).then(({content_permissions}) => {
      const { can_edit } = content_permissions[0];

      if(!can_edit) {
        get(this, 'notify').error('You must be signed in as the content owner to edit this resource.');
        this.transitionTo('index');
      }
    });
  }
});

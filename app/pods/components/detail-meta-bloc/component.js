import Component from '@ember/component';
import { get } from '@ember/object';
import { notEmpty } from '@ember/object/computed';
import { inject as service } from '@ember/service';

export default Component.extend({
  classNames: 'DetailMetaBloc',

  modals: service(),

  model: null,

  hasDirections: notEmpty('model.directionsUrl'),

  actions: {
    openContactMenu() {
      get(this, 'modals').showModal('modals/contact-poster', get(this, 'model'));
    }
  }
});

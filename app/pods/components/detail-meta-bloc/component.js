import Component from '@ember/component';
import { get } from '@ember/object';
import { readOnly, notEmpty } from '@ember/object/computed';
import { inject as service } from '@ember/service';

export default Component.extend({
  classNames: 'DetailMetaBloc',

  modals: service(),

  model: null,

  isEvent: readOnly('model.isEvent'),

  hasDirections: notEmpty('model.directionsUrl'),

  actions: {
    openContactMenu() {
      get(this, 'modals').showModal('modals/contact-poster', get(this, 'model'));
    }
  }
});

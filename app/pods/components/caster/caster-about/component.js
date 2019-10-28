import EmberObject, { get, computed, setProperties} from '@ember/object';
import { readOnly } from '@ember/object/computed';
import { inject as service } from '@ember/service';
import { htmlSafe } from '@ember/string';
import Component from '@ember/component';

export default Component.extend({
  classNames: ['Caster-CasterAbout'],

  modals: service(),

  caster: null,

  casterIsCurrentUser: readOnly('caster.isCurrentUser'),

  casterCanBeContacted: readOnly('caster.canBeContacted'),

  casterDescription: computed('caster.description', function() {
    return htmlSafe(get(this, 'caster.description'));
  }),

  casterWebsite: readOnly('caster.website'),

  actions: {
    contactCaster() {
      const caster = get(this, 'caster');
      const copyOfCaster = EmberObject.create();

      setProperties(copyOfCaster, {
        contactEmail: get(caster, 'emailIsPublic') ? get(caster, 'email') : null,
        contactPhone: get(caster, 'phone')
      });

      get(this, 'modals').showModal('modals/contact-poster', copyOfCaster);
    }
  }
});

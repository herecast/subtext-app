import { readOnly } from '@ember/object/computed';
import { inject as service } from '@ember/service';
import Component from '@ember/component';

export default Component.extend({
  classNames: ['Caster-CasterHides'],

  casterHideService: service('caster-hide'),
  casterHides: readOnly('casterHideService.casterHides')
});

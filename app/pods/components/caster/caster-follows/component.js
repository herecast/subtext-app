import { get, set, setProperties } from '@ember/object';
import { readOnly, notEmpty } from '@ember/object/computed';
import { inject as service } from '@ember/service';
import { debounce } from '@ember/runloop';
import Component from '@ember/component';

export default Component.extend({
  classNames: ['Caster-CasterFollows'],

  searchValue: null,
  searchMatches: null,
  isLoadingMatches: false,

  api: service(),
  casterFollowService: service('caster-follow'),
  store: service(),

  casterFollows: readOnly('casterFollowService.casterFollows'),

  hasInputValue: notEmpty('searchValue'),

  _getMatches() {
    const searchValue = get(this, 'searchValue') || null;

    if (searchValue && searchValue.length > 3) {
      set(this, 'isLoadingMatches', true);

      get(this, 'store').query('caster', {query: searchValue})
      .then((casters) => {
        set(this, 'searchMatches', casters);
      })
      .finally(() => {
        set(this, 'isLoadingMatches', false);
      });
    } else {
      set(this, 'searchMatches', null);
    }
  },

  actions: {
    valueChanging() {
      debounce(this, '_getMatches', 200);
    },

    clearSearch() {
      setProperties(this, {
        'searchValue': null,
        'searchMatches': null
      });
    }
  }
});

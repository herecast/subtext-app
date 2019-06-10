import { inject as service } from '@ember/service';
import { debounce } from '@ember/runloop';
import { isPresent } from '@ember/utils';
import { get, set } from '@ember/object';
import { A } from '@ember/array';
import $ from 'jquery';
import ManualDropdown from 'subtext-app/mixins/components/manual-dropdown';
import Component from '@ember/component';

export default Component.extend(ManualDropdown, {
  api: service('api'),

  venues: A(),
  hasPerformedSearch: false,

  didInsertElement() {
    this._super(...arguments);

    $(this.element).find('input').keyup(() => {
      const name = this.get('venueName');

      if (isPresent(name) && name.length > 2) {
        this.setProperties({
          hasPerformedSearch: true,
          isSearching: true,
          open: true
        });

        debounce(this, this.sendSearchQuery, name, 300);
      }
    });
  },

  willDestroyElement() {
    this._super(...arguments);

    $(this.element).find('input').off('keyUp');
  },

  sendSearchQuery(value) {
    const api = get(this, 'api');

    api.getVenues(value).then((response) => {
      this.setProperties({
        venues: response.venues,
        open: true,
        isSearching: false
      });
    });
  },

  actions: {
    setVenue(venue) {
      set(this, 'open', false);
      const setVenue = get(this, 'setVenue');
      if (setVenue) {
        setVenue(venue);
      }
    },

    addNewVenue() {
      set(this, 'open', false);
      const addNewVenue = get(this, 'addNewVenue');
      if(addNewVenue) {
        addNewVenue();
      }
    }
  }
});

import $ from 'jquery';
import Mixin from '@ember/object/mixin';
import { observer, set, get } from '@ember/object';
import { on } from '@ember/object/evented';
import { bind } from '@ember/runloop';

export default Mixin.create({
  classNames: ['dropdown'],
  classNameBindings: ['open'],

  // Since we're manually toggling the dropdown when results are found, we need
  // to manualy manage the click binding state. Otherwise the menu would not
  // close when a user clicks outside of it.
  initDropdownToggle: observer('open', function() {
    if (get(this, 'open')) {
      $('html').on('click.manual-dropdown',
        bind(this, () => {
          set(this, 'open', false);
        })
      );
    } else {
      $('html').off('click.manual-dropdown');
    }
  }),

  removeManualClick: on('willDestroyElement', function() {
    $('html').off('click.manual-dropdown');
  })
});

import Ember from 'ember';

export default Ember.Mixin.create({
  classNames: ['dropdown'],
  classNameBindings: ['open'],

  // Since we're manually toggling the dropdown when results are found, we need
  // to manualy manage the click binding state. Otherwise the menu would not
  // close when a user clicks outside of it.
  initDropdownToggle: function() {
    if (this.get('open')) {
      Ember.$('html').on('click.manual-dropdown', () => {
        this.set('open', false);
      });
    } else {
      Ember.$('html').off('click.manual-dropdown');
    }
  }.observes('open'),

  removeManualClick: function() {
    Ember.$('html').off('click.manual-dropdown');
  }.on('willDestroyElement')
});

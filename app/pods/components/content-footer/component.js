import Ember from 'ember';

export default Ember.Component.extend({
  tagName: 'footer',

  classNames: ['ContentFooter'],
  classNameBindings: [
    'center:ContentFooter--center',
    'noPadding:ContentFooter--noPadding'
  ],

  center: false,
  noPadding: false
});

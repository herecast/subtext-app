import Component from '@ember/component';

export default Component.extend({
  tagName: 'footer',

  classNames: ['ContentFooter'],
  classNameBindings: [
    'center:ContentFooter--center',
    'noPadding:ContentFooter--noPadding'
  ],

  center: false,
  noPadding: false
});

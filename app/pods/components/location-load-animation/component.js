import Component from '@ember/component';

export default Component.extend({
  classNames: ['LocationLoadAnimation'],
  classNameBindings: ['isWhite:is-white'],

  loadingLocationName: null,
  loadingMessage: 'Loading',
  isWhite: false
});

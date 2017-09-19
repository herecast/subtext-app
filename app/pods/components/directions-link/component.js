import Ember from 'ember';

const {computed} = Ember;

export default Ember.Component.extend({
  tagName: 'a',

  classNames: ['DirectionsLink'],
  attributeBindings: ['href', 'target'],

  href: computed.alias('url'),
  target: '_blank'
});

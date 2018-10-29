import { alias } from '@ember/object/computed';
import Component from '@ember/component';

export default Component.extend({
  tagName: 'a',

  classNames: ['DirectionsLink'],
  attributeBindings: ['href', 'target'],

  href: alias('url'),
  target: '_blank'
});

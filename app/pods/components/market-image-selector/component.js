import Ember from 'ember';

const {
  computed,
  get
} = Ember;

export default Ember.Component.extend({
  tagName: 'img',
  classNames: ['MarketPost-imageSelector'],
  attributeBindings: ['src'],
  classNameBindings: ['isActive:is-active'],

  src: null,
  currentImageUrl: null,

  isActive: computed('src', 'currentImageUrl', function() {
    return get(this, 'src') === get(this, 'currentImageUrl');
  })
});

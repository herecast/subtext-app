import Ember from 'ember';

const { get, computed } = Ember;


export default Ember.Component.extend({
  classNames: ['HeaderImage'],
  attributeBindings: ['data-test-component', 'style'],
  'data-test-component': 'header-image',

  style: computed('imageUrl', function() {
    const imageUrl = get(this, 'imageUrl');
    return Ember.String.htmlSafe(`background-image: url('${imageUrl}');`);
  })
});

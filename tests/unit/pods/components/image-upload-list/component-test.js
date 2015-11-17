import Ember from 'ember';
import { moduleForComponent, test } from 'ember-qunit';

moduleForComponent('image-upload-list', 'Unit | Component | image upload list', {
  // Specify the other units that are required for this test
  needs: ['component:form-group', 'helper:fa-icon'],
  unit: true
});

test('it renders', function(assert) {
  assert.expect(2);

  // Creates the component instance
  var component = this.subject({
    model: Ember.Object.create({
      images: [Ember.Object.create()]
    })
  });

  // Creates the component instance
  assert.equal(component._state, 'preRender');

  // Renders the component to the page
  this.render();
  assert.equal(component._state, 'inDOM');
});

import {
  moduleForComponent,
  test
} from 'ember-qunit';

moduleForComponent('content-comment', {
  // Specify the other units that are required for this test
  needs: ['component:report-abuse', 'component:avatar-image']
});

test('it renders', function(assert) {
  assert.expect(2);

  // Creates the component instance
  var component = this.subject();
  assert.equal(component._state, 'preRender');

  // Renders the component to the page
  this.render();
  assert.equal(component._state, 'inDOM');
});

import {
  moduleForComponent,
  test
} from 'ember-qunit';

moduleForComponent('event-preview', {
  // Specify the other units that are required for this test
  needs: ['template:events/show', 'component:report-abuse',
    'component:event-comments'
  ]
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

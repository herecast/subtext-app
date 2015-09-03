import Ember from 'ember';
import { moduleForComponent, test } from 'ember-qunit';

moduleForComponent('content-comments', 'Unit | Component | content comments', {
  // Specify the other units that are required for this test
  needs: ['component:comment-new', 'component:content-comment',
    'helper:fa-icon']
});

test('it renders', function(assert) {
  assert.expect(2);

  // Creates the component instance
  var component = this.subject({
    contentComments: {
      getComments: function() {
        return new Ember.RSVP.Promise((resolve) => {
          resolve([]);
        });
      }
    }
  });
  assert.equal(component._state, 'preRender');

  // Renders the component to the page
  this.render();
  assert.equal(component._state, 'inDOM');
});

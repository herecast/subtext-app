import { moduleForComponent, test } from 'ember-qunit';

moduleForComponent('dashboard-postings', 'Unit | Component | dashboard postings', {
  // Specify the other units that are required for this test
  // needs: ['component:foo', 'helper:bar'],
  needs: ['helper:eq', 'helper:not-eq','helper:capitalize','template:partials/pagination-nav'],
  unit: true
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

test('sortDirection correctly extracts first (ASC|DESC) from sort', function(assert) {
  var component = this.subject({
    sort: 'channel_type ASC, pubdate DESC'
  });

  assert.equal(component.get('sortDirection'), 'ASC');

  // Handles non values
  component.set('sort', undefined);
  assert.equal(component.get('sortDirection'), undefined);

  component.set('sort', '');
  assert.equal(component.get('sortDirection'), undefined);
});

test('sortBy sends to external sortBy action', function(assert) {
  assert.expect(2);

  const sortBy = 'pubdate ASC';

  const component = this.subject({
    sort: 'channel_type ASC, pubdate DESC',
    sortBy: function(sort) {
      assert.ok(1, "calls external sort action");
      assert.equal(sort, sortBy);
    }
  });

  component.send('sortBy',sortBy);
});

test('sortBy with same sort option reverses it', function(assert) {
  assert.expect(2);

  const sortBy = 'channel_type ASC, pubdate DESC';

  const component = this.subject({
    sort: sortBy,
    sortBy: function(sort) {
      assert.ok(1, "calls external sort action");
      assert.equal(sort, 'channel_type DESC, pubdate DESC');
    }
  });

  component.send('sortBy', sortBy);
});

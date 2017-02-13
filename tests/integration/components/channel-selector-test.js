import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('channel-selector', 'Integration | Component | channel selector', {
  integration: true
});

// test for:
  // title
  // content
  // is-selected class changes when selectedChannel changes
  // action fired

test('it renders', function(assert) {

  this.set('channel', {
    name: 'Fake',
    text: 'fake text'
  });

  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`
    {{channel-selector
      channel=(readonly channel)
    }}
  `);

  assert.equal(this.$().text().trim(), '');
});

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

test('Clicking', function(assert) {
  assert.expect(1);
  const done = assert.async();

  this.setProperties({
    channel: {name: 'Fake'},
    didClick(nm) {
      assert.equal(nm, 'Fake',
        "selectChannel action triggered with name"
      );

      done();
    }
  });

  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`
    {{channel-selector
      selectChannel=(action didClick)
      name=(readonly channel.name)
    }}
  `);

  this.$('[data-test-select-channel="Fake"]').click();
});

test('active state', function(assert) {
  assert.expect(1);

  this.render(hbs`
    {{channel-selector
      name="ChName"
      isActive=true
    }}
  `);

  assert.ok(
    this.$('.ChannelSelector').hasClass('is-active'),
    "has is-active class"
  );
});

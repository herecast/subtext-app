import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import startMirage from 'subtext-ui/tests/helpers/setup-mirage';

moduleForComponent('feed-card', 'Integration | Component | feed card', {
  integration: true,
  beforeEach() {
    startMirage(this.container);
  },
  afterEach() {
    window.server.shutdown();
  }
});

test('it renders', function(assert) {

  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });
  const model = server.create('feed-content', {normalizedContentType: 'news'});

  this.set('model', model);

  this.render(hbs`{{feed-card model=model}}`);

  assert.ok(this.$());
});

import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import startMirage from 'subtext-ui/tests/helpers/setup-mirage';

moduleForComponent('user-location/ugc-button', 'Integration | Component | user location/ugc button', {
  integration: true,
  beforeEach() {
    startMirage(this.container);
  },
  afterEach() {
    server.shutdown();
  }
});

test('it renders', function(assert) {
  const model = server.create('content');
  this.set('model', model);
  this.render(hbs`{{user-location/ugc-button model=model}}`);

  assert.ok(this.$());
});

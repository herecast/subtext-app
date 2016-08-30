import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import startMirage from '../../../../helpers/setup-mirage';

moduleForComponent('directory-landing', 'Integration | Component | directory landing', {
  integration: true,
  setup() {
    startMirage(this.container);
  }
});

test('it renders', function(assert) {
  const done = assert.async();

  this.render(hbs`{{directory-landing}}`);

  setTimeout(function() {
    assert.ok(this.$());
    done();
  });
});

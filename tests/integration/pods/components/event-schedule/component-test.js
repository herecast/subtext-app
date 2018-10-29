import EmberObject from '@ember/object';
import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | event schedule', function(hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function(assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });" + EOL + EOL +
    this.set('schedule', EmberObject.create({
      dates: []
    }));

    await render(hbs`{{event-schedule schedule=schedule}}`);

    assert.ok(this.element.querySelectorAll('.fc').length === 1, 'should render calendar');
  });
});

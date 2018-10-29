import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | mystuff/filter bar', function(hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function(assert) {
    let organizations = [
      {
        name: 'org-one'
      },
      {
        name: 'org-two'
      }
    ];
    this.set('organizations', organizations);

    let types = [
      'type-one',
      'type-two'
    ];
    this.set('types', types);

    await render(hbs`{{mystuff/filter-bar
      organizations=organizations
      types=types
    }}`);

    assert.equal(this.element.querySelectorAll('[data-test-button="mystuff-organization-choice-personal"]').length, 1, 'should show one choice for personal content');
    assert.equal(this.element.querySelectorAll('[data-test-button="mystuff-organization-choice"]').length, 2, 'should show two organization filter choices');
    assert.equal(this.element.querySelectorAll('[data-test-button="mystuff-content-type-choice"]').length, 2, 'should show two content type filter choices');

  });
});

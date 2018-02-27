import { moduleForComponent, test } from 'ember-qunit';
import testSelector from 'ember-test-selectors';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('mystuff/filter-bar', 'Integration | Component | mystuff/filter bar', {
  integration: true
});

test('it renders', function(assert) {
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

  this.render(hbs`{{mystuff/filter-bar
    organizations=organizations
    types=types
  }}`);

  assert.equal(this.$(testSelector('button', 'mystuff-organization-choice-personal')).length, 1, 'should show one choice for personal content');
  assert.equal(this.$(testSelector('button', 'mystuff-organization-choice')).length, 2, 'should show two organization filter choices');
  assert.equal(this.$(testSelector('button', 'mystuff-content-type-choice')).length, 2, 'should show two content type filter choices');

});

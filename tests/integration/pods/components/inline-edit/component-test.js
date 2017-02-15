import wait from 'ember-test-helpers/wait';
import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('inline-edit', 'Integration | Component | inline edit', {
  integration: true
});

test('Displaying value on render', function(assert) {
  this.set('value', 'Casting Crowns');

  // Template block usage:
  this.render(hbs`
    {{#inline-edit value=value}}
      {EDIT MODE}
    {{/inline-edit}}
  `);

  assert.equal(this.$().text().trim(), 'Casting Crowns');
});

test('Entering edit mode by click, exiting edit mode by focusout', function(assert) {
  this.setProperties({
    display: 'The band I am listening to',
    value: 'Matthew West'
  });

  // Template block usage:
  this.render(hbs`
    {{#inline-edit value=display}}
      <input type='text' value={{value}}>
    {{/inline-edit}}
  `);

  this.$('.InlineEdit-display').trigger('click');

  assert.equal(
    this.$('input').val(),
    "Matthew West",
    'Clicking displays edit mode (block)'
  );

  return wait().then(()=> {
    assert.ok(
      this.$('input:focus').length > 0,
      "The input is given focus"
    );

    this.$('input').trigger('focusout');
    return wait().then(()=>{
      assert.equal(
        this.$().text().trim(),
        'The band I am listening to',
        "focusout causes to leave edit mode"
      );
    });
  });
});

test('Entering edit mode by click, exiting edit mode by button action', function(assert) {
  this.setProperties({
    display: 'The band I am listening to',
    value: 'Matthew West'
  });

  // Template block usage:
  this.render(hbs`
    {{#inline-edit value=display focusChangesState=false as |exitEdit|}}
      <input type='text' value=value>
      <button onclick={{action exitEdit}}>Done Editing</button>
    {{/inline-edit}}
  `);

  this.$('.InlineEdit-display').click();
  assert.ok(this.$('input').length > 0, "In edit mode");

  this.$('button').click();

  return wait().then(()=> {
    assert.equal(
      this.$().text().trim(),
      'The band I am listening to',
      "Triggering action exits edit mode"
    );
  });
});

test('didExitEditMode action', function(assert) {
  const done = assert.async();

  this.setProperties({
    display: 'The band I am listening to',
    value: 'Matthew West',
    didExitEditMode() {
      assert.ok(true, "didExitEditMode triggered when leaving edit mode");
      done();
    }
  });

  // Template block usage:
  this.render(hbs`
    {{#inline-edit value=display isEditing=true didExitEditMode=(action didExitEditMode) focusChangesState=false as |exitEdit|}}
      <input type='text' value=value>
      <button onclick={{action exitEdit}}>Done Editing</button>
    {{/inline-edit}}
  `);

  this.$('button').click();
});

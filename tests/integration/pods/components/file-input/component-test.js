import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
/* global sinon */

moduleForComponent('file-input', 'Integration | Component | file input', {
  integration: true
});

function mockFileListWithFileName(fn) {
  var fileList = [
    {name: fn}
  ];
  // Mock FileList API
  fileList.item = function(idx) {
    return this[idx];
  };
  return fileList;
}

test('it renders a file input', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });" + EOL + EOL +

  this.render(hbs`{{file-input}}`);
  assert.equal(this.$('input[type=file]').length, 1);
});


test('Given ".jpg,.png" as allowedExtensions; the file input accept is equal to allowedExtensions', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });" + EOL + EOL +

  this.render(hbs`{{file-input allowedExtensions=".jpg,.png"}}`);
  var $fileInput = this.$('input[type=file]');
  assert.equal($fileInput.attr('accept'), ".jpg,.png");
});

test('Given no specified allowedExtensions; Select a file', function(assert) {
  const files = mockFileListWithFileName('myFile');
  var myAction = sinon.spy();

  this.setProperties({
    files: files,
    myAction: myAction
  });

  this.render(hbs`
    {{#file-input action=(action myAction) as |subject|}}
      <button {{action "didSelectFiles" files target=subject}}>Upload</button>
    {{/file-input}}
  `);

  this.$('button').click();

  assert.ok(myAction.calledWith(files), "The supplied action was called when files were selected.");
});

test('Given ".jpg,.png" as allowed extensions; Select a file named myFile.jpg', function(assert) {
  const files = mockFileListWithFileName('myFile.jpg');
  var myAction = sinon.spy();

  this.setProperties({
    files: files,
    myAction: myAction
  });

  this.render(hbs`
    {{#file-input allowedExtensions=".jpg,.png" action=(action myAction) as |subject|}}
      <button {{action "didSelectFiles" files target=subject}}>Upload</button>
    {{/file-input}}
  `);

  this.$('button').click();

  assert.ok(myAction.calledWith(files), "The supplied action was called when files were selected.");
});

test('Given ".jpg,.png" as allowed extensions; Select a file named myFile.png', function(assert) {
  const files = mockFileListWithFileName('myFile.png');
  var myAction = sinon.spy();

  this.setProperties({
    files: files,
    myAction: myAction
  });

  this.render(hbs`
    {{#file-input allowedExtensions=".jpg,.png" action=(action myAction) as |subject|}}
      <button {{action "didSelectFiles" files target=subject}}>Upload</button>
    {{/file-input}}
  `);

  this.$('button').click();

  assert.ok(myAction.calledWith(files), "The supplied action was called when files were selected.");
});

test('Given ".jpg,.png" as allowed extensions; Select a file named myFile.PNG', function(assert) {
  const files = mockFileListWithFileName('myFile.PNG');
  var myAction = sinon.spy();

  this.setProperties({
    files: files,
    myAction: myAction
  });

  this.render(hbs`
    {{#file-input allowedExtensions=".jpg,.png" action=(action myAction) as |subject|}}
      <button {{action "didSelectFiles" files target=subject}}>Upload</button>
    {{/file-input}}
  `);

  this.$('button').click();

  assert.ok(myAction.calledWith(files), "The supplied action was called when files were selected.");
});

test('Given ".jpg,.png" as allowed extensions; Select a file named myFile.something.notextension.png', function(assert) {
  const files = mockFileListWithFileName('myFile.something.notextension.png');
  var myAction = sinon.spy();

  this.setProperties({
    files: files,
    myAction: myAction
  });

  this.render(hbs`
    {{#file-input allowedExtensions=".jpg,.png" action=(action myAction) as |subject|}}
      <button {{action "didSelectFiles" files target=subject}}>Upload</button>
    {{/file-input}}
  `);

  this.$('button').click();

  assert.ok(myAction.calledWith(files), "The supplied action was called when files were selected.");
});

test('Given ".jpg,.png" as allowed extensions; Select a file named myFile.gif', function(assert) {
  assert.expect(2);

  const files = mockFileListWithFileName('myFile.gif');
  var myAction = sinon.spy();
  this.setProperties({
    files: files,
    myAction: myAction,
    onError: function(err) {
      assert.equal(err, "Only files with these extensions: .jpg,.png are allowed.", "The supplied supplied error handler was called.");
    }
  });

  this.render(hbs`
    {{#file-input fileError=(action onError) allowedExtensions=".jpg,.png" action=(action myAction) as |subject|}}
      <button {{action "didSelectFiles" files target=subject}}>Upload</button>
    {{/file-input}}
  `);

  this.$('button').click();
  assert.notOk(myAction.called, "The supplied action was not called when files were selected.");

});

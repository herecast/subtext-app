import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, triggerEvent } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import sinon from 'sinon';

module('Integration | Component | file input', function(hooks) {
  setupRenderingTest(hooks);

  function createFile(name) {
    const blob = new Blob(['test-file'], {type: 'image/png'});
    blob.lastModifiedDate = new Date();
    blob.name = name;
    return blob;
  }

  test('it renders a file input', async function(assert) {
    await render(hbs`{{file-input}}`);
    assert.ok(this.element.querySelector('input[type=file]'), 'has a file input');
  });


  test('Given ".jpg,.png" as allowedExtensions; the file input accept is equal to allowedExtensions', async function(assert) {
    await render(hbs`{{file-input allowedExtensions=".jpg,.png"}}`);
    var $fileInput = this.element.querySelector('input[type=file]');
    assert.equal($fileInput.getAttribute('accept'), ".jpg,.png");
  });

  test('Given no specified allowedExtensions; Select a file', async function(assert) {
    var myAction = sinon.spy();
    const file = createFile('myFile');
    const files = [file];

    this.set('myAction', myAction);

    await render(hbs`{{file-input action=(action myAction)}}`);

    await triggerEvent(this.element.querySelector('input[type=file]'), 'change', files);

    assert.ok(myAction.calledWith(files), "The supplied action was called when files were selected.");
  });

  test('Given ".jpg,.png" as allowed extensions; Select a file named myFile.jpg', async function(assert) {
    var myAction = sinon.spy();
    const file = createFile('myFile.jpg');
    const files = [file];

    this.set('myAction', myAction);

    await render(hbs`{{file-input allowedExtensions=".jpg,.png" action=(action myAction)}}`);

    await triggerEvent(this.element.querySelector('input[type=file]'), 'change', files);

    assert.ok(myAction.calledWith(files), "The supplied action was called when files were selected.");
  });

  test('Given ".jpg,.png" as allowed extensions; Select a file named myFile.png', async function(assert) {
    var myAction = sinon.spy();
    const file = createFile('myFile.png');
    const files = [file];

    this.set('myAction', myAction);

    await render(hbs`{{file-input allowedExtensions=".jpg,.png" action=(action myAction)}}`);

    await triggerEvent(this.element.querySelector('input[type=file]'), 'change', files);

    assert.ok(myAction.calledWith(files), "The supplied action was called when files were selected.");
  });

  test('Given ".jpg,.png" as allowed extensions; Select a file named myFile.PNG', async function(assert) {
    var myAction = sinon.spy();
    const file = createFile('myFile.PNG');
    const files = [file];

    this.set('myAction', myAction);

    await render(hbs`{{file-input allowedExtensions=".jpg,.png" action=(action myAction)}}`);

    await triggerEvent(this.element.querySelector('input[type=file]'), 'change', files);

    assert.ok(myAction.calledWith(files), "The supplied action was called when files were selected.");
  });

  test('Given ".jpg,.png" as allowed extensions; Select a file named myFile.something.notextension.png', async function(assert) {
    var myAction = sinon.spy();
    const file = createFile('myFile.something.notextension.png');
    const files = [file];

    this.set('myAction', myAction);

    await render(hbs`{{file-input allowedExtensions=".jpg,.png" action=(action myAction) }}`);

    await triggerEvent(this.element.querySelector('input[type=file]'), 'change', files);

    assert.ok(myAction.calledWith(files), "The supplied action was called when files were selected.");
  });

  test('Given ".jpg,.png" as allowed extensions; Select a file named myFile.gif', async function(assert) {
    assert.expect(2);

    var myAction = sinon.spy();
    const file = createFile('myFile.gif');
    const files = [file];
    this.setProperties({
      myAction: myAction,
      onError: function(err) {
        assert.equal(err, "Only files with these extensions: .jpg,.png are allowed.", "The supplied supplied error handler was called.");
      }
    });

    await render(hbs`{{file-input fileError=(action onError) allowedExtensions=".jpg,.png" action=(action myAction)}}`);

    await triggerEvent(this.element.querySelector('input[type=file]'), 'change', files);

    assert.notOk(myAction.called, "The supplied action was not called when files were selected.");
  });
});

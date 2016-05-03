import Ember from 'ember';
import { sanitizeContent } from 'subtext-ui/lib/content-sanitizer';
/*global jQuery*/

const {
  run,
  get, set,
  isPresent
} = Ember;

const defaultToolbarOpts = [
  ['style', ['bold', 'italic', 'underline', 'clear']],
  ['insert', ['link']]
];

export default Ember.Component.extend({
  classNames: ['wysiwyg-editor'],
  toolbar: defaultToolbarOpts,
  content: null,
  updateContent: false,

  willDestroyElement() {
    this.$('textarea').summernote('destroy');
  },

  didInsertElement() {
    const toolbar = get(this, 'toolbar');
    const content = get(this, 'content');
    const $editor = this.$('textarea');

    function insertImage(image) {
      $editor.summernote('insertImage', image.url);
    }

    let summerNoteConfig = {
      // DO NOT set height.  It causes all kinds of issues
      // with summernote's absolute positioned overlays.
      //height: height,
      styleWithSpan: false,
      toolbar: toolbar,

      callbacks: {
        onChange: () => {
          // must use onChange and not keyUp
          // (for video embeds)
          this.send('doUpdate');
        },
        onCreateLink: (url) => {
          url = url.trim();
          const protocol = /^[a-z]+:/i;

          if (!protocol.test(url)) {
            url = 'http://' + url;
          }

          return url;
        },
        onImageUpload: (file) => {
          return this.attrs.uploadImage(file[0]).then(({image}) => {
            return insertImage(image);
          });
        },
        onPaste: (e) => {
          e.preventDefault();

          const buffer = ((e.originalEvent || e).clipboardData || window.clipboardData).getData('text/html');
          const div = document.createElement('div');
          div.innerHTML = buffer;

          run.later(() => {
            const cleanNodes = sanitizeContent(div);
            const $div = jQuery('<div>').append(cleanNodes);
            // Strip styles from images to prevent weird positioning and floating.
            $div.find('img[style]').removeAttr('style');

            const cleanHtml = $div.html();

            $editor.summernote('pasteHTML', cleanHtml);

            // SummerNote likes to add a <p><br></p> when pasting multi-line content
            // This causes the spacing to expand, which is undesirable
            // So clear it out, but only change the editor contents if necessary
            // as this could screw up the cursor position
            const editorContent = this.$('.note-editable').html();
            let newContent = editorContent.replace(/<p><br><\/p>/g, '');
            if (editorContent !== newContent) {
              this._setEditorContent(newContent);
            }

            this.send('doUpdate');
          });
        }
      }
    };

    if (isPresent(this.attrs.buttons)) {
      summerNoteConfig.buttons = this.attrs.buttons.value;
    }

    if (isPresent(this.attrs.modules)) {
      summerNoteConfig.modules = this.attrs.modules.value;
    }

    if (isPresent(this.attrs.popover)) {
      summerNoteConfig.popover = this.attrs.popover.value;
    }

    $editor.summernote(summerNoteConfig);

    if (content) {
      // Initialize editor with content
      this._setEditorContent(content);
    }
  },

  _setEditorContent(content) {
    Ember.$('.note-editable').html(content);
  },

  didUpdateAttrs(attrs) {
    this._super(...arguments);

    // Only update the editor with new content if updateContent flag is set
    // This avoids a bug where the cursor jumps when the user types
    const updateContent = get(attrs, 'newAttrs.updateContent.value');

    if (updateContent) {
      this._setEditorContent(get(attrs, 'newAttrs.content'));
      set(this, 'updateContent', false);
    }
  },

  actions: {
    doUpdate() {
      const content = this.$('.note-editable').html();

      // Notify new content
      if ('notifyChange' in this.attrs) {
        this.attrs.notifyChange(content);
      }
    }
  }
});

import Ember from 'ember';
import { sanitizeContent } from 'subtext-ui/lib/content-sanitizer';

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
  editorHeight: null, // editor will use this for height if set
  height: 120,
  defaultToolbar: defaultToolbarOpts,

  willDestroyElement() {
    this.$('textarea').summernote('destroy');
  },

  didInsertElement() {
    const height = get(this, 'editorHeight') || get(this, 'height');
    let toolbar;
    const content = get(this, 'content');

    if (isPresent(this.attrs.toolbar)) {
      toolbar = this.attrs.toolbar.value;
    } else {
      toolbar = get(this, 'defaultToolbar');
    }

    const $editor = this.$('textarea');

    function insertImage(image) {
      $editor.summernote('insertImage', image.url);
    }

    $editor.summernote({
      height: height,
      toolbar: toolbar,

      styleWithSpan: false,

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
        onPaste: () => {
          // TODO modify this to prevent default
          // and prevent insecure content from
          // ever being inserted into the DOM as per
          // https://github.com/summernote/summernote/issues/303#issuecomment-110885954
          run.later(() => {
            const el = Ember.$('.note-editable'),
                  cleanContent = sanitizeContent(el[0]);

            el.html(cleanContent);

            this.send('doUpdate');
          });
        }
      }
    });

    if (content) {
      // Initialize editor with content
      this._setEditorContent(content);
    }
  },

  _setEditorContent(content) {
    Ember.$('.note-editable').html(content);
  },

  didReceiveAttrs() {
    // Update the editor if we have new content
    const content = get(this, 'attrs.content.value');
    if (get(this, 'content') !== content) {
      this._setEditorContent(content);
    }

    this._super();
  },

  actions: {
    doUpdate() {
      const content = this.$('.note-editable').html();

      set(this, 'content', content);

      // TODO The upper context should simply be notified of
      // changes and should have the responsiblity for deciding
      // what to do. The text editor should no concept of
      // form validation
      if (this.attrs.validateForm) {
        this.attrs.validateForm();
      }
    }
  }
});

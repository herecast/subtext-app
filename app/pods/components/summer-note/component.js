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
  content: null,
  updateContent: false,

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
        onPaste: (e) => {
          const buffer = ((e.originalEvent || e).clipboardData || window.clipboardData).getData('text/html'),
                domParser = new DOMParser(), 
                doc = domParser.parseFromString(buffer),
                cleanContent = sanitizeContent(doc);
                
          e.preventDefault();
          
          run.later(() => {
            $editor.summernote('insertNode', cleanContent);

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

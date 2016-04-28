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
  defaultToolbar: defaultToolbarOpts,
  content: null,
  updateContent: false,

  willDestroyElement() {
    this.$('textarea').summernote('destroy');
  },

  didInsertElement() {
    let toolbar, buttons, popover, modules;
    const content = get(this, 'content');

    if (isPresent(this.attrs.toolbar)) {
      toolbar = this.attrs.toolbar.value;
    } else {
      toolbar = get(this, 'defaultToolbar');
    }
    
    if (isPresent(this.attrs.buttons)) {
      buttons = this.attrs.buttons.value;
    } else {
      buttons = {};
    }
    
    if (isPresent(this.attrs.modules)) {
      modules = this.attrs.modules.value;
    } else {
      modules = {};
    }
    
    if (isPresent(this.attrs.popover)) {
      popover = this.attrs.popover.value;
    } else {
      popover = {};
    }

    const $editor = this.$('textarea');

    function insertImage(image) {
      $editor.summernote('insertImage', image.url);
    }

    $editor.summernote({
      // DO NOT set height.  It causes all kinds of issues
      // with summernote's absolute positioned overlays.
      //height: height,
      modules: modules,
      toolbar: toolbar,
      buttons: buttons,
      popover: popover,
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
    }
  }
});

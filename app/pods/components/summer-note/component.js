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
  height: 120,
  defaultToolbar: defaultToolbarOpts,

  willDestroyElement() {
    this.$('textarea').summernote('destroy');
  },

  didInsertElement() {
    const height = get(this, 'height');
    let toolbar;
    const content = get(this, 'content');

    if (isPresent(this.attrs.toolbar)) {
      toolbar = this.attrs.toolbar.value;
    } else {
      toolbar = get(this, 'defaultToolbar');
    }

    this.$('textarea').summernote({
      height: height,
      toolbar: toolbar,

      styleWithSpan: false,

      callbacks: {
        onChange: () => {
          // must use onChange and not keyUp
          // (for video embeds)
          this.send('doUpdate');
        },
        onImageUpload: (file) => {
          function doSomethingElse(something) {
            alert('this should happen last');
            // TODO construct image node, and insert into post via
            // insertion api
          }
          this.attrs.uploadImage(file[0], doSomethingElse);
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
      },

      onCreateLink(url) {
        url = url.trim();
        const protocol = /^[a-z]+:/i;

        if (!protocol.test(url)) {
          url = 'http://' + url;
        }

        return url;
      }
    });

    if (content) {
      // Initialize editor with content
      Ember.$('.note-editable').html(content);
    }
  },

  actions: {
    doUpdate() {
      const content = this.$('.note-editable').html();

      set(this, 'content', content);

      // TODO i don't like this ~cm
      // The upper context should be notified of changes
      // and should have the responsiblity for deciding
      // what to do
      if (this.attrs.validateForm) {
        this.attrs.validateForm();
      }
    }
  }
});

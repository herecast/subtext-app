import Ember from 'ember';

const { computed } = Ember;

export default Ember.Component.extend({
  classNames: ['GradientTruncation'],
  stripHtml: false,

  formattedText: computed('text', function() {
    if (this.get('stripHtml')) {
      const tmp = document.createElement("div");
      tmp.innerHTML = this.get('text');
      return tmp.textContent || tmp.innerText || "";
    } else {
      return this.get('text');
    }

  })
});

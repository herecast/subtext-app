import Ember from 'ember';

export default Ember.Component.extend({
  classNames: ['GradientTruncation'],
  stripHtml: false,

  formattedText: function() {
    if (this.get('stripHtml')) {
      const tmp = document.createElement("div");
      tmp.innerHTML = this.get('text');
      return tmp.textContent || tmp.innerText || "";
    } else {
      return this.get('text');
    }

  }.property('text')
});

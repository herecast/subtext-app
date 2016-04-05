import Ember from 'ember';

const { on } = Ember;

export default Ember.Component.extend({
  contents: [],

  setupItems: on('init', function() {
    const contents = this.get('contents').toArray();

    const newsItem1 = contents.findBy('contentType', 'news');
    contents.removeObject(newsItem1);

    const newsItem2 = contents.findBy('contentType', 'news');
    contents.removeObject(newsItem2);

    this.setProperties({
      newsItem1: newsItem1,
      newsItem2: newsItem2
    });

    contents.forEach((item, index) => {
      this.set(`item${index+1}`, item);
    });
  })
});

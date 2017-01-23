import Ember from 'ember';

const {
  set,
  get,
  getWithDefault,
  inject,
  isPresent,
  isEmpty
} = Ember;

export default Ember.Component.extend({
  attributeBindings: ['data-test-component', 'data-test-listserv-content'],
  'data-test-listserv-content': Ember.computed.oneWay('listservContent.id'),

  listservContent: null,
  enhancedPost: null,
  cachedAttributes: Ember.Object.create(),

  store: inject.service(),
  api: inject.service(),

  _buildEnhancedPost(category) {
    const listservContent = get(this, 'listservContent'),
          cachedAttributes = get(this, 'cachedAttributes'),
          modelType = category === 'market' ? 'market-post' : category;


    // Build the enhanced content item with data from the listserv content
    const enhancedPost = get(this, 'store').createRecord(modelType, {
      listservIds: [get(listservContent, 'listserv.id')]
    });

    // set attributes from cache or listserv record
    //
    enhancedPost.setProperties({
      title: getWithDefault(cachedAttributes, 'title', get(listservContent, 'subject')),
      content: getWithDefault(cachedAttributes, 'content', get(listservContent, 'body'))
    });

    if(modelType !== 'talk') {
      enhancedPost.setProperties({
        contactEmail: getWithDefault(cachedAttributes, 'contactEmail', get(listservContent, 'senderEmail')),
        contactPhone: get(cachedAttributes, 'contactPhone')
      });
    }

    const image = get(cachedAttributes, 'image');
    const imageFile = get(cachedAttributes, 'imageFile');
    if(isPresent(image)) {
      if(modelType === 'market-post') {
        get(enhancedPost, 'images').pushObject(
          get(this, 'store').createRecord('image', {
            primary: true,
            originalImageFile: imageFile,
            file: image
          })
        );
      } else {
        enhancedPost.setProperties({
          originalImageFile: imageFile,
          image: image
        });
      }
    }

    return enhancedPost;

  },

  _cacheAttributes(enhancedPost) {
    const enhancedPostType = get(enhancedPost, '_internalModel.modelName');
    const cachedAttributes = get(this, 'cachedAttributes');

    // base attributes
    cachedAttributes.setProperties({
      title: get(enhancedPost, 'title'),
      content: get(enhancedPost, 'content')
    });

    if(enhancedPostType !== 'talk') {
      // non-talk attributes
      cachedAttributes.setProperties({
        contactEmail: get(enhancedPost, 'contactEmail'),
        contactPhone: get(enhancedPost, 'contactPhone')
      });
    }

    // Cache one image
    if(enhancedPostType === 'market-post') {
      cachedAttributes.setProperties({
        imageFile: get(enhancedPost, 'primaryImage.originalImageFile'),
        image: get(enhancedPost, 'primaryImage.file')
      });
    } else {
      cachedAttributes.setProperties({
        imageFile: get(enhancedPost, 'originalImageFile'),
        image: get(enhancedPost, 'image')
      });
    }
  },

  didInsertElement() {
    this._super(...arguments);
    const api = get(this, 'api');

    if(isEmpty(get(this, 'enhancedPost'))) {
      const channelType = get(this, 'listservContent.channelType');
      set(this, 'enhancedPost', this._buildEnhancedPost(channelType || "talk"));
    }

    api.updateListservProgress(get(this, 'listservContent.id'), {
      'step_reached': 'edit_post'
    });
  },

  actions: {
    changeCategory(category) {
      const currentPost = get(this, 'enhancedPost');
      const api = get(this, 'api');

      set(this, 'listservContent.channelType', category);

      // cache attributes from previous record
      this._cacheAttributes(currentPost);

      // rollback previous record and images
      const images = get(currentPost, 'images');
      if(isPresent(images)) {
        images.invoke('rollbackAttributes');
      }
      currentPost.rollbackAttributes();

      // rebuild
      set(this, 'enhancedPost', this._buildEnhancedPost(category));

      api.updateListservProgress(get(this, 'listservContent.id'), {
        'channel_type': category
      });
    },
    afterDetails() {
      const enhancedPost = get(this, 'enhancedPost'),
        listservContent = get(this, 'listservContent');

      set(listservContent, 'subject', get(enhancedPost, 'title'));
      set(listservContent, 'body', get(enhancedPost, 'content'));

      get(this, 'previewEnhancedPost')();
    }
  }
});

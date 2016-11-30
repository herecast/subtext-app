import DS from 'ember-data';

export default DS.RESTSerializer.extend({
  isNewSerializerAPI: true,
  normalize(typeClass, hash, prop) {
    hash.img = hash.category_image;
    hash.banner = hash.detail_page_banner;

    delete hash.category_image;
    delete hash.detail_page_banner;

    return this._super(typeClass, hash, prop);
  }
});

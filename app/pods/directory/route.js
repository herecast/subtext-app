import Ember from 'ember';

const { RSVP } = Ember;

const categories = [{
  "id":"10000",
  "name":"Restaurants",
  "description":"",
  "icon_class":"fa-cutlery",
  "child_categories": [{
    "id":"10001",
    "name":"Italian Restaurants",
    "description":""
  },{
    "id":"10002",
    "name":"Cafes",
    "description":""
  },{
    "id":"10003",
    "name":"French Restaurants",
    "description":""
  },{
    "id":"10004",
    "name":"Pizza",
    "description":""
  },{
    "id":"10005",
    "name":"American Restaurants",
    "description":""
  },{
    "id":"10006",
    "name":"Fine Dining",
    "description":""
  },{
    "id":"10007",
    "name":"Casual Dining",
    "description":""
  },{
    "id":"10008",
    "name":"Mexican Restaurants",
    "description":""
  },{
    "id":"10009",
    "name":"Chinese Restaurants",
    "description":""
  },{
    "id":"10010",
    "name":"Korean Restaurants",
    "description":""
  }]
},{
  "id":"20000",
  "name":"Drinks",
  "description":"",
  "icon_class":"fa-glass",
  'child_categories': [{
    "id":"20001",
    "name":"Martinis",
    "description":"",
    "icon_class":""
  },{
    "id":"20002",
    "name":"Beer",
    "description":"",
    "icon_class":""
  },{
    "id":"20003",
    "name":"Craft Beer",
    "description":"",
    "icon_class":""
  },{
    "id":"20004",
    "name":"Sports Bars",
    "description":"",
    "icon_class":""
  }]
},{
  "id":"30000",
  "name":"Coffee",
  "description":"",
  "icon_class":"fa-coffee",
  'child_categories': [{
    "id":"30001",
    "name":"Donuts",
    "description":"",
    "icon_class":""
  },{
    "id":"30002",
    "name":"Drive Through",
    "description":"",
    "icon_class":""
  }]
},{
  "id":"40000",
  "name":"Home Services",
  "description":"",
  "icon_class":"fa-wrench",
  'child_categories': [{
    "id":"40001",
    "name":"Plumbing",
    "description":"",
    "icon_class":"fa-life-ring"
  },{
    "id":"40002",
    "name":"Heating",
    "description":"",
    "icon_class":"fa-fire"
  },{
    "id":"40003",
    "name":"Gardening",
    "description":"",
    "icon_class":""
  },{
    "id":"40004",
    "name":"Lawn Care",
    "description":"",
    "icon_class":""
  },{
    "id":"40005",
    "name":"Painting",
    "description":"",
    "icon_class":"fa-paint-brush"
  },{
    "id":"40006",
    "name":"Moving",
    "description":"",
    "icon_class":""
  },{
    "id":"40007",
    "name":"Carpentry",
    "description":"",
    "icon_class":""
  },{
    "id":"40008",
    "name":"Electricians",
    "description":"",
    "icon_class":"fa-plug"
  },{
    "id":"40009",
    "name":"Plowing",
    "description":"",
    "icon_class":""
  },{
    "id":"40010",
    "name":"Cleaning",
    "description":"",
    "icon_class":""
  }]
},{
  "id":"50000",
  "name":"Automotive",
  "description":"",
  "icon_class":"fa-car",
  'child_categories': [{
    "id":"50001",
    "name":"Auto Repairs",
    "description":"",
    "icon_class":""
  },{
    "id":"50002",
    "name":"Towing",
    "description":"",
    "icon_class":""
  },{
    "id":"50003",
    "name":"Auto Supplies",
    "description":"",
    "icon_class":""
  },{
    "id":"50004",
    "name":"Auto Detailing",
    "description":"",
    "icon_class":""
  },{
    "id":"50005",
    "name":"Auto Sales",
    "description":"",
    "icon_class":""
  },{
    "id":"50006",
    "name":"Used Cars",
    "description":"",
    "icon_class":""
  },{
    "id":"50007",
    "name":"Used Trucks",
    "description":"",
    "icon_class":""
  },{
    "id":"50008",
    "name":"New Cars",
    "description":"",
    "icon_class":""
  },{
    "id":"50009",
    "name":"New Trucks",
    "description":"",
    "icon_class":""
  }]
},{
  "id":"60000",
  "name":"Transportation",
  "description":"",
  "icon_class":"fa-taxi",
  'child_categories': [
  ]
}];

const results = [{
  name: "fred's plumbing",
  coords: { lat: 40.003, lng: -80.003},
  content: '<h1>random content</h1>',
  address: '363 River Street, Springfield, VT'
},{
  name: "martha's plumbing",
  coords: { lat: 40.000, lng: -80.000},
  content: '<p><b>non-random</b> content</p>',
  address: '365 River Street, Springfield, VT'
}];

export default Ember.Route.extend({
  model() {
    return RSVP.hash({
      results: results,
      categories: categories
    });
  },

  setupController(controller, model) {
    controller.set('categories', model.categories);
    controller.set('parentCategory', model.categories[0]);
    controller.set('results', model.results);
  }
});

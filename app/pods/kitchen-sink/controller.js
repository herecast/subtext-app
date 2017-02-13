import Ember from 'ember';

const {
  get,
  set
} = Ember;

export default Ember.Controller.extend({
  selectedChannel: 'Talk',

  channels: [{
    name: 'Event',
    text: `<p>My post is intended to announce or promote:<p>
           <ul>
             <li>an event</li>
             <li>a class</li>
             <li>a meeting</li>
           </ul>`
  },{
    name: 'Market',
    text: `<p>My post is intended to help me:<p>
           <ul>
             <li>buy or sell something</li>
             <li>list a free item</li>
             <li>find a service or a job</li>
           </ul>`
  },{
    name: 'Talk',
    text: `<p>My post is:<p>
           <ul>
             <li>a general comment</li>
             <li>a question or concern</li>
             <li>a discussion topic</li>
           </ul>`
  }],

  actions: {
    selectChannel(name) {
      const selectedChannel = get(this, 'channels').findBy('name', name);

      set(this, 'selectedChannel', get(selectedChannel, 'name'));
    }
  }
});

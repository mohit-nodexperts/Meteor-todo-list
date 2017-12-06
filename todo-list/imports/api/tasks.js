import { Mongo } from 'meteor/mongo';
import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';

var moment = require('moment')
export const Tasks = new Mongo.Collection('tasks');

if(Meteor.isServer)
{
    Meteor.publish('tests',function taskspublication(){
        return Tasks.find({
            $or :[{ private : {$ne : true}},
                { owner : this.userId },
            ],
        });
    });
}

Meteor.methods({
    'tasks.insert'(text) {
      check(text, String);
   
      // Make sure the user is logged in before inserting a task
      if (! Meteor.userId()) {
        throw new Meteor.Error('not-authorized');
      }
   
      Tasks.insert({
        text,
        createdAt: moment(),
        owner: Meteor.userId(),
        username: Meteor.user().username,
      });
    },
    'tasks.remove'(taskId) {
      check(taskId, String);
   
      Tasks.remove(taskId);
    },
    'tasks.setChecked'(taskId, setChecked) {
      check(taskId, String);
      check(setChecked, Boolean);
   
      Tasks.update(taskId, { $set: { checked: setChecked } });
    },
    'tasks.setPrivate'(taskId,setPrivate){
        check(taskId,String);
        check(setPrivate,Boolean);

       const t_task = Tasks.findOne(taskId);

       if(t_task.owner != Meteor.userId())
       return Meteor.Error("Unauthorised User");

       Tasks.update(taskId, { $set : {private : setPrivate}});
    },
    'tasks.isDue'(taskId,setDue){
        check(taskId,String);
        check(setDue,Boolean);

        Tasks.update(taskId,{ $set : {late : setDue}});
    },
  });
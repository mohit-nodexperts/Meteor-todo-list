import { Mongo } from 'meteor/mongo';
import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';

const moment = require('moment');
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

	/**
   * Insert Task
   * @param { String } text 
   * Returns callback
   */
	'tasks.insert'(text) {
		check(text, String);
   
		// Make sure the user is logged in before inserting a task
		if (! Meteor.userId()) {
			throw new Meteor.Error('not-authorized');
		}
   
		Tasks.insert({
			text,
			createdAt: new Date(),
			owner: Meteor.userId(),
			username: Meteor.user().username,
		});
	},
	/**
     * Remove Task
     * @param { String } taskId 
     */
	'tasks.remove'(taskId) {
		check(taskId, String);
   
		Tasks.remove(taskId);
	},
	/**
     * Set Check For Check/Uncheck Event
     * @param { String } taskId 
     * @param { Boolean } setChecked
     */
	'tasks.setChecked'(taskId, setChecked) {
		check(taskId, String);
		check(setChecked, Boolean);
   
		Tasks.update(taskId, { $set: { checked: setChecked } });
	},
	/**
     * Set Private For Toggle-Private event
     * @param { String } taskId 
     * @param { Boolean } setPrivate 
     */
	'tasks.setPrivate'(taskId,setPrivate) {
		check(taskId,String);
		check(setPrivate,Boolean);

		const t_task = Tasks.findOne(taskId);
		if(t_task.owner != this.userId)
			throw new Meteor.Error('Unauthorised User');

		Tasks.update(taskId, { $set : {private : setPrivate}});
	},
	/**
     * Sets Late Field For Tasks Whose Due Date of One Day Has Passed
     * @param {*} taskId 
     * @param {*} setDue 
     */
	'tasks.isDue'(taskId,setDue){
		check(taskId,String);
		check(setDue,Boolean);

		Tasks.update(taskId,{ $set : {late : setDue}});
	},
});
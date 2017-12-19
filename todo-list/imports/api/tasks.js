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
<<<<<<< Updated upstream
		});
=======
		},
	{
		sort :{createdAt : 1},
		skip: page > 0 ? ((page) * pageSize) : 0,
		limit: pageSize,	
	});
	});
	Accounts.validateLoginAttempt(function (attempt) {
		if(!attempt.allowed)
			return false;
			console.log(attempt.user.services.resume.loginTokens.length);
			if(attempt.user.services.resume.loginTokens.length>1)
			{
				throw new Meteor.Error(300,"Multiple client login");
			}
			else
			return attempt.allowed;
>>>>>>> Stashed changes
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
	'update.multilogin'(user) {
		let u=Meteor.users.find({username:user});
		if(u.count()>0)
		{
			let	us=Meteor.users.find({username:user}).fetch()[0];
			let token=us.services.resume.loginTokens=[];
		  return Meteor.users.update({ _id: us._id }, { $set: { 'services.resume.loginTokens': token } });
		}
	},
});
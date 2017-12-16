import { Template } from 'meteor/templating';

import { Meteor } from 'meteor/meteor';

import { Tasks } from '../api/tasks.js';
 
import './task.html';

import calculate from '../ui/body.js';

import { Session } from 'meteor/session';
Template.task.helpers({
	isOwner()
	{
		return (this.owner==Meteor.userId());
	},
	pastDueDate()
	{ 
		if(!this.late){
			if(moment().subtract(1,'day').isAfter(moment(this.createdAt)))
				Meteor.call('tasks.isDue',this._id,true);
		}
		return (this.late);
	},
}); 
Template.task.events({
	'click .toggle-checked'() {
		// Set the checked property to the opposite of its current value
		Meteor.call('tasks.setChecked', this._id, !this.checked);
	},
	'click .delete'() {
		Meteor.call('tasks.remove', this._id);
		Session.set('tasks',Session.get('tasks')-1);
		calculate();
	},
	'click .toggle-private'(){
		Meteor.call('tasks.setPrivate',this._id,! this.private);
	},
});

import { Template } from 'meteor/templating';

import {Meteor} from 'meteor/meteor';
 
import { Tasks } from '../api/tasks.js';

import { ReactiveDict } from 'meteor/reactive-dict';

import './task.js';

import './body.html';
import './login.html';
import './login.js';

import { Session } from 'meteor/session';
import { Accounts } from 'meteor/accounts-base';

Template.body.onCreated(function bodyOnCreated() {
	this.state = new ReactiveDict();
	Session.set('page',0);
	Session.set('pageSize',5);
	
	this.autorun(() => {
		calculation();
		this.subscribe('tests',Session.get('page'),Session.get('pageSize'));
	});
});

export default function calculation() {
	Meteor.call('tasks.count', (err, res) => {
		Session.set('tasks',res);
	});
	if(Session.get('tasks')%Session.get('pageSize')==0)
	{
		Session.set('pages',Math.floor(Session.get('tasks')/Session.get('pageSize')));
		if(Session.get('page')==Session.get('pages'))
		Session.set('page',Session.get('page')-1);
	}
	else
	Session.set('pages',Math.floor(Session.get('tasks')/Session.get('pageSize'))+1);
	
};

Template.body.helpers({
	tasks() {
		const instance = Template.instance();
		if (instance.state.get('hideCompleted')) {
			// If hide completed is checked, filter tasks
			return Tasks.find({ checked: { $ne: true } }, { sort: { createdAt: -1 } });
		}
		// Otherwise, return all of the tasks
		return Tasks.find({});
	},
	incompleteCount() {
		return Tasks.find({ checked: { $ne: true } }).count();
	},
	completeCount() {
		return Tasks.find({}).count();
	},
	isNext(){
		return Session.get('page') < Session.get('pages')-1;
	},
	isPrev(){
		if(Session.get('page')> 0)
		return true
		return false;
	},
});
Template.body.events({
	/**
   * Insert New Task In Todo-List
   * @param { Event } event 
   */
	'submit .new-task'(event) {
		// Prevent default browser form submit
		event.preventDefault();
 
		// Get value from form element
		const target = event.target;
		const text = target.text.value;
 
		// Insert a task into the collection
		Meteor.call('tasks.insert', text);

		Session.set('tasks',Session.get('tasks')+1);
		calculation();
		// Clear form
		target.text.value = '';
	},
	/**
   * 
   * @param { Event } event 
   * @param { Instance } instance 
   */
	'change .hide-completed input'(event, instance) {
		instance.state.set('hideCompleted', event.target.checked);
	},
	'click #prevPage'(event,instance){
		let val = Session.get('page');
		Session.set('page',val-1);
	},
	'click #nextPage'(event,instance){
		let val = Session.get('page');
		Session.set('page',val+1);
	},
	'click #signout'(event){
		Meteor.logout();
	}
});


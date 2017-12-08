import { Template } from 'meteor/templating';

import {Meteor} from 'meteor/meteor';
 
import { Tasks } from '../api/tasks.js';

import { ReactiveDict } from 'meteor/reactive-dict';

import './task.js';

import './body.html';

Template.body.onCreated(function bodyOnCreated() {
	this.state = new ReactiveDict();
	Meteor.subscribe('tests');
});

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
});


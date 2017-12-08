import { Meteor } from 'meteor/meteor';
import { Random } from 'meteor/random';
import { assert } from 'meteor/practicalmeteor:chai';
import { expect } from 'meteor/practicalmeteor:chai';

import { Tasks } from './tasks.js';

if (Meteor.isServer) {
	describe('Tasks', () => {
		describe('methods', () => {
			const userId = Random.id();
			let taskId;

			beforeEach(() => {
				Tasks.remove({});
				taskId = Tasks.insert({
					text: 'test task',
					createdAt: new Date(),
					owner: userId,
					username: 'tmeasday',
					private:false,
				});
			});
			it('can delete owned task', () => {
				// Find the internal implementation of the task method so we can
				// test it in isolation
				const deleteTask = Meteor.server.method_handlers['tasks.remove'];
        
				// Set up a fake method invocation that looks like what the method expects
				const invocation = { userId };
                            
				// Run the method with `this` set to the fake invocation
				deleteTask.apply(invocation, [taskId]);
                            
				// Verify that the method does what we expected
				assert.equal(Tasks.find({}).count(), 0);
			});
			it('can not change not owned tasks privacy', () => {
				// Find the internal implementation of the task method so we can
				// test it in isolation
				const changePrivacy =Meteor.server.method_handlers['tasks.setPrivate'];

				// Generating new userId for testing
				const userId=Random.id();

				// Set up a fake method invocation that looks like what the method expects
				const invocation = { userId };

				// verify that the method throw an Error
				expect( () => { changePrivacy.apply(invocation,[taskId,true]); }).to.throw(Meteor.Error);
			});
			it('can change owned tasks privacy', () => {
				// Find the internal implementation of the task method so we can
				// test it in isolation
				const changePrivacy =Meteor.server.method_handlers['tasks.setPrivate'];

				// Generating new userId for testing
				const invocation = { userId };

				// Run the method with `this` set to the fake invocation
				changePrivacy.apply(invocation,[taskId,true]);

				// Fetching the change from MongoDb
				const detail = Tasks.find({},{private:1,_id:0}).fetch()[0];

				// Verify that the method does what we expected
				assert.equal(detail.private,true);
			});
		});
	});
}
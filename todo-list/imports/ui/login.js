import './login.html';
import { Meteor } from 'meteor/meteor';
let userInfo = new ReactiveVar({});

Template.login.events({
  'submit #loginform'(event){
    event.preventDefault();

    Meteor.loginWithPassword($('#username').val(),$('#pass').val(), function(err,res){
      if(err)
      {
        if(err.error==300)
        {
          $("#multiusersignin").modal({backdrop: 'static', keyboard: false});
          userInfo.set($('#username').val());
        }
      }
    })
  },
  'click #multiloginsigninuser'(e){
    e.preventDefault();
    Meteor.call('update.multilogin',userInfo.get(),function(err ,res) {
      if(err)
      {
        $("#multiusersignin").modal('toggle');         
      }
      Meteor.loginWithPassword($('#username').val(), $('#pass').val(), function (err, res) {
        $("#multiusersignin").modal('toggle');  
        $('body').removeClass('modal-open');          
            if (err) {
                // console.log(err)
                showError.set(true);
            }
      })
    })
  }
})
var server = holla.createClient({debug:true});
var user = new Object();
user.conferance = new Array();

function rtcLog(message) {
  $("#presence-log").prepend("<div>"+message+"</div>")
}

function startRTC(name) {

    $("#me").html(name);

    holla.createFullStream(function(err, stream) {

        if (err) throw err;

        holla.pipe(stream, $("#meVideo"));

        server.register(name, function(worked) {
          
          //set handler on call
          server.on("call", function(call) {

            if (err) throw err;

            call.addStream(stream);

            rtcLog("incoming call from "+call.user);

            call.answer();

            console.log(call);

            call.ready(function(stream) {

              console.log(stream);
              holla.pipe(stream, addUser(call.user));

            });

            call.on("hangup", function() {
              removeUser(call.from);
                });
          });

          server.on("presence", function(user){

            if (user.online) {

              rtcLog(user.name + " is online.")

              if (!user.online || $("#"+user.name).length != 0) return;

              var call = server.call(user.name);

              rtcLog("Calling "+user.name);

              call.addStream(stream);

              call.ready(function(stream) {

                 holla.pipe(stream, addUser(user.name));

              });

              call.on("hangup", function() {
                removeUser(user.name);
              });

            } else {
              rtcLog(user.name + " went offline.")
              removeUser(user.name);
            }

          });
          
          server.on("chat", function(chat){
            rtcLog(chat.from+": "+chat.message);
          });


        });
  });
}

function addUser(username) {
  var item = $('<div class="span4"><h2 id="'+username+'">'+username+'</h2><video width="300" id="'+username+'Video" autoplay="true"></video></div>');
  $("#conferance").append(item);
  var result = $("#"+username+"Video");
  user.conferance.push(username);
  return result;
}

function removeUser(username) {
  user.conferance.splice(user.conferance.indexOf(username),1);
  $("#"+username).parent().remove();
}

$(function(){

  $("#connect").click(function(e){
    e.preventDefault();
    user.name = $("#username").val();
    startRTC(user.name);
    $("#connect").hide();
  });

  $("#chatboxSend").click(function() {
    var message = $("#chatbox").val();
    rtcLog(user.name + ": "+ message);
    $.each(user.conferance, function(index, value) {
      server.chat(value, message);
    });
  });

});


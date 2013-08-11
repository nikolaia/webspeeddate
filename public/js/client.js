function ClientCtrl($scope) {

  $scope.calls = [];
  $scope.messages = [];

  $scope.connect = function () {
    $scope.server = holla.createClient({debug:true});
    holla.createFullStream(function(err, stream) { 

      $scope.$apply(function () {
        var server = $scope.server;
        server.register($scope.name, function(worked) {});
        server.on("call", function(call) { $scope.answer(call,stream) });
        server.on("presence", function(user) { $scope.presence(user,stream)});
        server.on("chat", $scope.addMessage);

        holla.pipe(stream, angular.element('#meVideo'));
      });
    });
  };

  $scope.presence = function (user, stream) {
    if (!user.online) {
      $scope.messages.push({name:"@"+user.name, message:user.name+" has gone offline."});
      $scope.removeUser(user.name);
    } else {
      $scope.addUser(user.name);
      var call = $scope.server.call(user.name);
      call.addStream(stream);

      call.ready(function(stream) {
        $scope.$apply(function () {
          console.log(angular.element("#"+call.user+"Video"));
          setTimeout(function() {
            holla.pipe(stream, angular.element("#"+call.user+"Video"));
          }, 1000);
          $scope.messages.push({name:"@"+call.user, message:call.user+" has come online."});
        });
      });
    
      call.on("hangup", function() {
        $scope.$apply(function () {
          $scope.removeUser(call.from);
        });
      });
    }
  };

  $scope.answer = function (call, stream) {

    $scope.addUser(call.user);
    call.addStream(stream);
    call.answer();

    call.ready(function(stream) {
      $scope.$apply(function () {
        setTimeout(function() {
          holla.pipe(stream, angular.element("#"+call.user+"Video"));
        }, 1000);
        $scope.messages.push({name:"@"+call.user, message:call.user+" has come online."});
      });
    });

    call.on("hangup", function() {
        $scope.removeUser(call.from);
    });

  };

  $scope.addUser = function (user) {
    $scope.$apply(function () {
      $scope.calls.push({ name: user });
    });
  };

  $scope.removeUser = function (user) {
    $scope.$apply(function () {
      $scope.calls.pop($scope.calls.indexOf(user));
    });
  };

  $scope.hangup = function () {
    angular.forEach($scope.calls, function(user) {
      $scope.server.hangup(user.name);
      $scope.calls.pop($scope.calls.indexOf(user));
    });
    $("#presence-log").scrollTop($("#presence-log")[0].scrollHeight);
  };

  $scope.sendMessage = function () {
    $scope.messages.push({name:"@"+$scope.name, message:$scope.message});
    angular.forEach($scope.calls, function(user) {
      $scope.server.chat(user.name, $scope.message);
    });
    $scope.message = "";
    $("#presence-log").scrollTop($("#presence-log")[0].scrollHeight);
  };

  $scope.addMessage = function(chat) {
    $scope.$apply(function () {
      $scope.messages.push({name:"@"+chat.from, message:chat.message});
    });
    $("#presence-log").scrollTop($("#presence-log")[0].scrollHeight);
  };

};
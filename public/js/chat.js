angular.module('chatbox', []).
  directive('chat', function() {
    return {
      restrict: 'E',
      transclude: true,
      scope: {},
      controller: function($scope, $element) {

        var messages = $scope.messages = [];
 
        $scope.select = function(pane) {
          angular.forEach(panes, function(pane) {
            pane.selected = false;
          });
          pane.selected = true;
        }
 
        this.addMessage = function(message) {
          message.push(message);
        }
      },
      template:
        '<div class="well">'+
          '<div id="presence-log">'+
            '<div ng-repeat="message in messages">'+
              '<span class="chat-from">@{{user.name}}</span>:'+
              '&nbsp;&nbsp;&nbsp;&nbsp;'+
              '<span class="chat-message">{{message}}</span>'+
            '</div>'+
          '</div>'+
          '<form class="form-search">'+
            '<div class="input-prepend">'+
              '<span class="add-on">@</span>'+
              '<input id="chatbox" class="span4" type="text" placeholder="Enter your message here...">'+
            '</div>'+
            '<button id="chatboxSend" type="submit" class="btn">Send</button>'+
          '</form>'+
        '</div>',
      replace: true
    };
  });
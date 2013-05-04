function HollaCtrl($scope) {

 	$scope.recieve = function(){
		var rtc = holla.connect();
		rtc.register("bob", function(worked) {
			  rtc.on("call", function(call) {
			
			    holla.createFullStream(function(err, stream) {
			      call.addStream(stream);
			      call.answer();
			    });
			
			  });
		});

  	};

 	$scope.send = function(){
		var rtc = holla.createClient();
		rtc.register("tom", function(worked) {
		  holla.createFullStream(function(err, stream) {
		    var call = rtc.call("bob");
		    call.addStream(stream);
		  });
		});

  	};
};
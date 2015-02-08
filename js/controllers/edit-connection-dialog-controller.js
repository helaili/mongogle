mongogleApp.controller('editConnectionController', function ($scope, $modalInstance, dbConnection) {
	$scope.newConnection = dbConnection;


	$scope.update = function () {
		storedb('connections').find({'name' : $scope.newConnection.name},function(findError, findResult){
  			if(!findError) {
  				if(findResult.length == 0) {
    				storedb('connections').insert($scope.newConnection, function(insertError, insertResult) {
						if(!insertError) {
							$modalInstance.close($scope.newConnection); 
						} else {

						}
					});	
				} else {
					$scope.error = 'Connection name should be unique';
				}
  			} else {
  			
  			}
		});				
	};

	$scope.test = function () {
		$scope.error = null;
		$scope.success = null;

		var uri = 'mongodb://' + $scope.newConnection.address;
		if($scope.newConnection.rs != null) {
			uri += '/?replicaSet=' + $scope.newConnection.rs;
		} 

		MongoClient.connect(uri, function(err, db) {
			  
			  if(err) {
			  	$scope.error = err;
			  } else {
			  	$scope.success = 'Connection succeeded';	
			  }
			  $scope.$digest();
			  
		});
	};

	$scope.cancel = function () {
		$modalInstance.dismiss('cancel');
	};

	$scope.confirmDelete = function() {
		$modalInstance.close(dbConnection);
	};
});

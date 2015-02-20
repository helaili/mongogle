mongogleApp.controller('editConnectionController', function ($scope, $modalInstance, dbConnection) {
	$scope.newConnection = dbConnection;


	$scope.update = function () {
		storedb('connections').find({'name' : $scope.newConnection.name},function(findError, findResult){
  			if(!findError) {
  				if(findResult.length == 0 || findResult[0]._id == $scope.newConnection._id) {
    				storedb('connections').update({'_id' : $scope.newConnection._id}, 
    											{'$set' : {'name' : $scope.newConnection.name, 
    													   'address' : $scope.newConnection.address,
    													   'rs': $scope.newConnection.rs}},  function(updateError, updateResult) {
						if(!updateError) {
							$modalInstance.close($scope.newConnection); 
						} else {
							console.log('Error while trying to update connection with name = ' + $scope.newConnection.name + ' and _id != ' + $scope.newConnection._id);
							console.log(updateError);
						}
					});	
				} else {
					$scope.error = 'Connection name should be unique';
				}
  			} else {
  				console.log('Error while trying to retreive connection with name = ' + $scope.newConnection.name + ' and _id != ' + $scope.newConnection._id);
  			}
		});				
	};

	$scope.save = function () {
		storedb('connections').find({'name' : $scope.newConnection.name},function(findError, findResult){
  			if(!findError) {
  				if(findResult.length == 0) {
  					$scope.newConnection.nodeType = 'con';
    				storedb('connections').insert($scope.newConnection, function(insertError, insertResult) {
						if(!insertError) {
							$modalInstance.close($scope.newConnection); 
						} else {
							console.log('Error while trying to inster connection with name = ' + $scope.newConnection.name + ' and _id != ' + $scope.newConnection._id);
							console.log(insertError);
						}
					});	
				} else {
					$scope.error = 'Connection name should be unique';
				}
  			} else {
  				console.log('Error while trying to retreive connection with name = ' + $scope.newConnection.name + ' and _id != ' + $scope.newConnection._id);
  			}
		});				
	};

	$scope.delete = function () {
		storedb('connections').remove({'name' : $scope.newConnection.name},function(deleteError){
  			if(!deleteError) {
  				$modalInstance.close($scope.newConnection); 
  			} else {
  				console.log('Error while trying to remove connection with name = ' + $scope.newConnection.name + ' and _id != ' + $scope.newConnection._id);
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
});

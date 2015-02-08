mongogleApp.controller("databaseTreeController", function ($scope, $location, $modal) {

  $scope.editModeStatus = false;

	$scope.initTree = function() {
    $("[name='editTreeToggleButton']").bootstrapSwitch();
    $("[name='editTreeToggleButton']").on('switchChange.bootstrapSwitch', function(event, state) {
      $scope.editModeStatus = !$scope.editModeStatus;
      $scope.$digest();
    });
    $scope.serverTree = storedb('connections').find();



/*
		$scope.serverTree = [
  {
    "id": 1,
    "title": "tree1 - item1",
    "expanded" : false,
    "nodes": []
  },
  {
    "id": 3,
    "title": "tree1 - item3",
    "nodes": []
  },
  {
    "id": 4,
    "title": "tree1 - item4",
    "nodes": []
  }
];

*/
	};

  $scope.removeConnection = function(node) {
    $scope.dbConnection = node;
    var modalInstance = $modal.open({
      templateUrl: 'views/delete-connection-view.html',
      controller: 'connectionController',
      resolve: {
        dbConnection: function () {
          return node;
        }
      }
    });

    modalInstance.result.then(function (dbConnection) {
      console.log('Delete connection: ' + dbConnection.name);

      storedb('connections').remove({'name' : dbConnection.name},function(findError, findResult){
          if(!findError) {
            $scope.serverTree = storedb('connections').find();
          } else {
          
          }
      });       
    });

  };


  $scope.editConnection = function(node) {
    $scope.newConnection = node;
    var modalInstance = $modal.open({
      templateUrl: 'views/edit-connection-view.html',
      controller: 'editConnectionController',
      resolve: {
        dbConnection : function () {
          return node;
        }
      }
    });

    modalInstance.result.then(function (dbConnection) {
      console.log('Edit connection: ' + dbConnection.name);

    });

  };



  
  $scope.clickNode = function(node) {
    console.log(node);
  };

});
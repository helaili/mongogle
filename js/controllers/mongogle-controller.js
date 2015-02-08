mongogleApp.controller("mongogleController", function ($scope, $location, $modal) {
  
  $scope.openNewConnectionDialog = function() {
    var modalInstance = $modal.open({
      templateUrl: 'views/new-connection-view.html',
      controller: 'newConnectionController'
    });

    modalInstance.result.then(function (newConnection) {
      console.log('New connection: ' + newConnection.name);
    });
  };

});


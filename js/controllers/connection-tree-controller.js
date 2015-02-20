mongogleApp.controller("databaseTreeController", function ($rootScope, $scope, $location, $modal) {

  $scope.editModeStatus = false;

	$scope.initTree = function() {
    $("[name='editTreeToggleButton']").bootstrapSwitch();
    $("[name='editTreeToggleButton']").on('switchChange.bootstrapSwitch', function(event, state) {
      $scope.editModeStatus = !$scope.editModeStatus;
      $scope.$digest();
    });
    var serverTree = storedb('connections').find();
    for(conCounter = 0; conCounter < serverTree.length; conCounter++) {
      serverTree[conCounter].nodes = [];
    }
    $scope.serverTree = serverTree;
	};


  $scope.openNewConnectionDialog = function() {
    var modalInstance = $modal.open({
      templateUrl: 'views/new-connection-view.html',
      controller: 'editConnectionController',
      resolve: {
        dbConnection: function () {
          return {};
        }
      }
    });

    modalInstance.result.then(function (dbConnection) {
      $scope.serverTree = storedb('connections').find();
    });
  };

  $scope.removeConnection = function(node) {
    $scope.dbConnection = node;
    var modalInstance = $modal.open({
      templateUrl: 'views/delete-connection-view.html',
      controller: 'editConnectionController',
      resolve: {
        dbConnection: function () {
          return node;
        }
      }
    });

    modalInstance.result.then(function (dbConnection) {
      $scope.serverTree = storedb('connections').find();
    });
  };


  $scope.editConnection = function(node) {
    $scope.newConnection = {};
    $scope.newConnection._id = node._id;
    $scope.newConnection.name = node.name;
    $scope.newConnection.address = node.address;
    $scope.newConnection.rs = node.rs;


    var modalInstance = $modal.open({
      templateUrl: 'views/edit-connection-view.html',
      controller: 'editConnectionController',
      resolve: {
        dbConnection : function () {
          return $scope.newConnection;
        }
      }
    });

    modalInstance.result.then(function (dbConnection) {
      $scope.serverTree = storedb('connections').find();
    });

  };
  
  $scope.clickConnectionNode = function(context, node) {
    var uri = 'mongodb://' + node.address;
    if(node.rs != null) {
      uri += '/?replicaSet=' + node.rs;
    } 

    MongoClient.connect(uri, function(err, db) {
        if(err) {
          $scope.error = err;
          console.log(err);
        } else {
          var adminDb = db.admin();
          node.nodes = [];
              
          adminDb.listDatabases(function(listDBError, dbs) {
            if(listDBError) {
              $scope.error = listDBError;
              console.log(listDBError);
            } else {
              for(dbCounter = 0; dbCounter < dbs.databases.length; dbCounter++) {
                var dbUri = 'mongodb://' + node.address + '/' + dbs.databases[dbCounter].name;
                if(node.rs != null) {
                  dbUri += '?replicaSet=' + node.rs;
                } 

                node.nodes.push({
                  "name": dbs.databases[dbCounter].name,
                  "uri" : dbUri,
                  "nodeType" : "db",
                  "nodes": []
                });
              }

              context.$nodeScope.$digest(); 
            }

            db.close();

          });
        }
        
    });
  };


  $scope.clickDBNode = function(context, node) {
    MongoClient.connect(node.uri, function(err, db) {
        if(err) {
          $scope.error = err;
        } else {
          node.nodes = [];

          db.collections(function(err, collections) {
            for(collCounter = 0; collCounter < collections.length; collCounter++) {
              node.nodes.push({
                "name": collections[collCounter].collectionName,
                "uri" : node.uri,
                "nodeType" : "coll",
                "nodes": []
              }); 
              context.$nodeScope.$digest();              
            }
            db.close(); 
          });
        }
    });
  };

  $scope.clickCollectionNode  = function(context, node) {
    $rootScope.$broadcast('clickCollectionNode', node);
  };


  $scope.clickNode = function(context, node) {
    context.$nodeScope.toggle();
    if(node.nodeType == 'con') {
      $scope.clickConnectionNode(context, node);
    } else if(node.nodeType == 'db') {
      $scope.clickDBNode(context, node);
    } else if(node.nodeType == 'coll') {
      $scope.clickCollectionNode(context, node);
    }
  };


});
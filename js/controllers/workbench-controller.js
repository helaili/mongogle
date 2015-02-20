mongogleApp.controller("workbenchController", function ($scope, $location, $modal) {

	$scope.$on('clickCollectionNode', function (event, node) { 
		if($scope.tabs == null) {
			$scope.tabs = [];
		}
		var tab = {};
		tab.title = node.name;
		tab.content = "<h1>YESSS</h1>";
    	$scope.tabs.push(tab);
  	});

});

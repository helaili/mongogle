mongogleApp.config(function ($routeProvider) {
	$routeProvider
		.when('/', {
			templateUrl: 'views/home-view.html',
			controller: 'mongogleController'
		})
		.otherwise({
			redirectTo: '/'
		});
});
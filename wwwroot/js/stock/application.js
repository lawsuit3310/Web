var context = new Object();

document.addEventListener('DOMContentLoaded', function() {
	var app = angular.module("InvestmentApp", ['ngRoute'])
	
	app.config(function($routeProvider) {
		$routeProvider
			.when("/", {
				templateUrl : "app/InfoToday.html",
				controller : "InfoTodayController"
		})
			.when("/1", {
				templateUrl : "app/InfoToday.html",
				controller : "InfoToday1Controller"
		})
			.when("/a", {
				templateUrl : "app/InfoToday.html",
				controller : "InfoToday2Controller"
		})
	})
	app.controller("InfoTodayController", ['$scope', '$http', function($scope, $http) {
		const url = `https://lawsuit3310.run.goorm.io/Stock/balance`;
	
		$http.get(url).then(x => {
			$scope.balance = context.balance == null ? x : context.balance;
			console.log(x['data']['output2'])
			context.balance = $scope.balance;
		});
		
	}])
	app.controller("InfoToday1Controller", function($scope) {
	})
	app.controller("InfoToday2Controller", function($scope) {
	})
})
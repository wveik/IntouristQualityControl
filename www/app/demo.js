var app = angular.module('mobileApp', ['ngRoute', 'ngAnimate', 'ui.bootstrap']);

app.config(function($routeProvider) {
  $routeProvider.when('/',						{templateUrl: 'views/main.html', reloadOnSearch: false});
  $routeProvider.when('/index.html',			{templateUrl: 'views/index.html', reloadOnSearch: false});   
  $routeProvider.when('/test.html', 			{templateUrl: 'views/test.html', reloadOnSearch: false}); 
  $routeProvider.when('/index_enter.html',		{templateUrl: 'views/index_enter.html', reloadOnSearch: false}); 
  $routeProvider.when('/question_type0.html',	{templateUrl: 'views/question_type0.html', reloadOnSearch: false}); 
  $routeProvider.when('/question_type1.html',	{templateUrl: 'views/question_type1.html', reloadOnSearch: false}); 
  $routeProvider.when('/load.html',				{templateUrl: 'views/load.html', reloadOnSearch: false}); 
  $routeProvider.when('/message.html',			{templateUrl: 'views/message.html', reloadOnSearch: false}); 
  $routeProvider.when('/plane.html',			{templateUrl: 'views/plane.html', reloadOnSearch: false}); 
});

app.directive( 'backButton', function() {
    return {
        restrict: 'A',
        link: function( scope, element, attrs ) {
            element.on( 'click', function () {
                history.back();
                scope.$apply();
            } );
        }
    };
} )

app.controller('MainCtrl', function ($scope, $http, $location, $window) {

	//$scope.path = 'http://localhost:61619/Mobile';
	$scope.path = 'http://test-mobile.ntk-intourist.ru/Mobile';
	$scope.my_email = "";
	$scope.selected = null;

	/*$scope.$on("$routeChangeSuccess", function (scope, next, current) {
        $scope.transitionState = "active"
    });*/
  
	$scope.registrate = function (my_email) {

		var url = $scope.path + "/Registration?login=" + my_email + "/callback=JSON_CALLBACK";

		$http({
	        method  : "POST",
	        url     : $scope.path + "/Registration",
	        data    : $.param({'login': my_email}),
	        headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
        }).
        success(function (data, status, headers, config) {
            var result = parseInt(data) == 1;
        	if (result) {
        		alert('Вы зарегистрированы. Пароль на почте');
        	} else {
        		alert('У вас неверен Email');
        	}
        }).
        error(function (data, status, headers, config) {
            alert('Используйте другой Email');
        });

	}

	$scope.enter = function (login, password) { 
		$location.path( "/load.html" );

		$http({
	        method  : "POST",
	        url     : $scope.path + "/IsRegistration",
	        data    : $.param({
	        	'login': login,
	        	'password': password
	        }),
	        headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
        }).
        success(function (data, status, headers, config) {
        	var result = parseInt(data) == 1;
        	if (result) {
        		$scope.my_email = login;
        		$location.path( "/index.html" );
        	} else {
        		alert('У вас неверен Email или пароль');
        		$window.history.back();
        	}        	
        }).
        error(function (data, status, headers, config) {
            alert('У вас неверен Email или пароль');
            $location.path( "/index.html" );
        });
	}

	$scope.GetTopicList = function (login, password) { 

		$http({
	        method  : "POST",
	        url     : $scope.path + "/GetTopicList",
	        headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
        }).
        success(function (data, status, headers, config) {
        	$scope.TopicList = data.Items;
        }).
        error(function (data, status, headers, config) {
            console.log(data);
        });
	}

	$scope.GoToQuestion = function (item){
		
		$scope.selected = item;

		if(parseInt($scope.selected.Topic.MTL_TYPE) == 0) {
			$location.path( "/question_type0.html" );
		}else{
			$location.path( "/question_type1.html" );
		}
	}

	$scope.SendRating = function(){
		$location.path( "/load.html" );

		$http({
	        method  : "POST",
	        url     : $scope.path + "/SendRating",
	        data    : $.param({
	        	'selected'	: angular.toJson($scope.selected),
	        	'email'		: $scope.my_email
	        }),
	        headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
        }).
        success(function (data, status, headers, config) {
        	$location.path( "/plane.html" );
        }).
        error(function (data, status, headers, config) {
            $window.alert('Ошибка');
            // $location.path( "/index.html" );
            $window.history.back();
        });
	}

	$scope.SetEmailToLogin = function(my_email){
		$scope.login = my_email;
	}

	$scope.GetTopicList();
  
});
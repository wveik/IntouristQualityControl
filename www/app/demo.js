var app = angular.module('mobileApp', ['ngRoute', 'ngAnimate', 'ui.bootstrap']);

app.config(function($routeProvider) {
  $routeProvider.when('/',						{templateUrl: 'views/main.html', reloadOnSearch: false});
  $routeProvider.when('/index.html',			{templateUrl: 'views/index.html', reloadOnSearch: false, star : true});   
  $routeProvider.when('/test.html', 			{templateUrl: 'views/test.html', reloadOnSearch: false}); 
  $routeProvider.when('/index_enter.html',		{templateUrl: 'views/index_enter.html', reloadOnSearch: false}); 
  $routeProvider.when('/question_type0.html',	{templateUrl: 'views/question_type0.html', reloadOnSearch: false, star : true}); 
  $routeProvider.when('/question_type1.html',	{templateUrl: 'views/question_type1.html', reloadOnSearch: false, star : true}); 
  $routeProvider.when('/load.html',				{templateUrl: 'views/load.html', reloadOnSearch: false}); 
  $routeProvider.when('/message.html',			{templateUrl: 'views/message.html', reloadOnSearch: false}); 
  $routeProvider.when('/plane.html',            {templateUrl: 'views/plane.html', reloadOnSearch: false}); 
  $routeProvider.when('/bonus.html',            {templateUrl: 'views/bonus.html', reloadOnSearch: false, pig : true}); 
  $routeProvider.when('/doc.html',              {templateUrl: 'views/doc.html', reloadOnSearch: false, doc : true});
  $routeProvider.when('/infotour.html',         {templateUrl: 'views/infotour.html', reloadOnSearch: false, info : true}); 
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
	$scope.my_email = localStorage.login;
	$scope.selected = null;
    $scope.sum_bonus = 0;

    //Окраска нижнего меню
    $scope.template_class_pig = "glyphicon glyphicon-piggy-bank";
    $scope.class_pig = $scope.template_class_pig;

    $scope.template_class_start = "glyphicon glyphicon glyphicon-star";
    $scope.class_star = $scope.template_class_start;

    $scope.template_class_doc = "glyphicon glyphicon glyphicon-list-alt";
    $scope.class_doc = $scope.template_class_doc;

    $scope.template_class_info = "glyphicon glyphicon glyphicon-briefcase";
    $scope.class_info = $scope.template_class_info;

	$scope.$on("$routeChangeSuccess", function (scope, next, current) {
        $scope.class_pig = $scope.template_class_pig;
        $scope.class_star = $scope.template_class_start;
        $scope.class_doc = $scope.template_class_doc;
        $scope.class_info = $scope.template_class_info;

        if(next.$$route.pig)    $scope.class_pig += " g_b";
        if(next.$$route.star)   $scope.class_star += " g_b";
        if(next.$$route.doc)    $scope.class_doc += " g_b";
        if(next.$$route.info)   $scope.class_info += " g_b";
    });

    $scope.SetMessageName = function(name){
        $scope.message_name = name;
    }

	$scope.registrate = function (my_email) {

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
        		alert('Данный e-mail уже зарегистрирован, нажмите ВОЙТИ');
        	}
        }).
        error(function (data, status, headers, config) {
            alert('Данный e-mail уже зарегистрирован, нажмите ВОЙТИ');
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
                $scope.GetTopicList();
                localStorage.login = $scope.my_email;
        	} else {
        		alert('Неверен EMAIL или пароль');
        		$window.history.back();
        	}        	
        }).
        error(function (data, status, headers, config) {
            alert('Неверен EMAIL или пароль');
            $location.path( "/index.html" );
        });
	}

	$scope.GetTopicList = function (login, password) { 

		$http({
	        method  : "POST",
	        url     : $scope.path + "/GetTopicList",
            data    : $.param({
                'mail': $scope.my_email
            }),
	        headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
        }).
        success(function (data, status, headers, config) {
        	$scope.TopicList = data.Items;
            $location.path( "/index.html" );
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
            $scope.selected.Topic.disabled = "true";

        }).
        error(function (data, status, headers, config) {
            $window.alert('Ошибка');
            // $location.path( "/index.html" );
            $window.history.back();
        });
	}

    $scope.GetBonusSum = function(){

        $location.path( "/load.html" );

        $http({
            method  : "POST",
            url     : $scope.path + "/GetBonusSum",
            data    : $.param({
                'email'     : $scope.my_email
            }),
            headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
        }).
        success(function (data, status, headers, config) {
            $location.path( "/bonus.html" );
            $scope.sum_bonus = data;
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
  
});
angular.module('LastFm', ['ngResource']).
    factory('ArtistResource',function ($resource) {
        return $resource('http://ws.audioscrobbler.com/2.0/?method=artist.:op&artist=:artist&api_key=:key&format=json', {},
            {get: {method: 'GET', params: {key: 'cb9ca0d2e59511e8583870dddde59cb0'}}});
    }).factory('CountryResource',function ($resource) {
        return $resource('http://ws.audioscrobbler.com/2.0/?method=geo.gettopartists&country=:country&api_key=:key&format=json', {},
            {get: {method: 'GET', params: {key: 'cb9ca0d2e59511e8583870dddde59cb0'}}});
    }).factory('myHttpInterceptor',function ($q, $window, $rootScope) {
        return function (promise) {
            $rootScope.nowloading = true; // use ng-show="nowloading" on element containing spinner
            $rootScope.active = "progress-striped active progress-warning";
            return promise.then(function (response) {
                // do something on success
                $rootScope.nowloading = false; // need to turn it off on success
                $rootScope.active = "progress-success";
                return response;

            }, function (response) {
                // do something on error
                $rootScope.nowloading = false;  // need to turn it off on failure
                $rootScope.active = "progress-success";
                $rootScope.network_error = true;   // you might want to show an error icon.
                $rootScope.alertType = "alert-info";
                $rootScope.alertMessage = "Error";
                return $q.reject(response);
            });
        };
    }).config(function ($httpProvider) {
        $httpProvider.responseInterceptors.push('myHttpInterceptor');

    }).config(['$routeProvider', function ($routeProvider) {
        $routeProvider.
            when('/', {templateUrl: '/partials/artists.html', controller: ArtistCtrl}).
            when("/topAlbums/:artist", {templateUrl: '/partials/albums.html', controller: AlbumCtrl}).
            when("/topFans/:artist", {templateUrl: '/partials/fans.html', controller: FanCtrl}).
            when("/topTracks/:artist", {templateUrl: '/partials/tracks.html', controller: TrackCtrl}).
            otherwise({redirectTo: '/'});
    }]);


function AlbumCtrl($scope, $routeParams, ArtistResource) {

    $scope.artist = $routeParams.artist;

    $scope.albumsResult = ArtistResource.get({op: 'gettopalbums', artist: $scope.artist});
}

function FanCtrl($scope, $routeParams, ArtistResource) {

    $scope.artist = $routeParams.artist;


    $scope.fansResult = ArtistResource.get({op: 'gettopfans', artist: $scope.artist});
}

function TrackCtrl($scope, $routeParams, ArtistResource) {

    $scope.artist = $routeParams.artist;

    $scope.tracksResult = ArtistResource.get({op: 'gettoptracks', artist: $scope.artist});
}


function ArtistCtrl($scope, $location, CountryResource) {

    $scope.countries = [
        {name: "Germany"},
        {name: "Spain"},
        {name: "Japan"},
        {name: "Mexico"},
        {name: "Belgium"},
        {name: "Israel"},
        {name: "United States"},
        {name: "United Kingdom"},
        {name: "France"},
        {name: "Sweden"},
        {name: "Chile"},
        {name: "Greece"},
        {name: "Denmark"},
        {name: "Finland"},
        {name: "India"},
        {name: "Norway"},
        {name: "Portugal"},
        {name: "Italy"},
        {name: "Iceland"}
    ];

    $scope.orderProp = 'name';

    $scope.country = $scope.countries[9];

    $scope.findTopArtists = function () {
        $location.path("/"); //sets up artists template in case it is called with another template in focus
        $scope.artistsResult = CountryResource.get({country: $scope.country.name});

    }
}
angular.module('LastFm', ['ngResource']).
    factory('LastFmResource',function ($resource) {
        return $resource('http://ws.audioscrobbler.com/2.0/?method=:op&artist=:artist&country=:country&api_key=:key&format=json', {},
            {get: {method: 'GET', params: {key: 'cb9ca0d2e59511e8583870dddde59cb0'}}});
    }).config(['$routeProvider', function ($routeProvider) {
        $routeProvider.
            when('/', {templateUrl: '/partials/artists.html', controller: ArtistController}).
            when("/topAlbums/:artist", {templateUrl: '/partials/albums.html', controller: AlbumController}).
            when("/topFans/:artist", {templateUrl: '/partials/fans.html', controller: FanController}).
            when("/topTracks/:artist", {templateUrl: '/partials/tracks.html', controller: TrackController}).
            otherwise({redirectTo: '/'});
    }]).factory('myHttpInterceptor',function ($q, $window, $rootScope) {
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

    });


function AlbumController($scope, $routeParams, LastFmResource) {

    $scope.artist = $routeParams.artist;

    $scope.albumsResult = LastFmResource.get({op: 'artist.gettopalbums', artist: $scope.artist});
}

function FanController($scope, $routeParams, LastFmResource) {

    $scope.artist = $routeParams.artist;


    $scope.fansResult = LastFmResource.get({op: 'artist.gettopfans', artist: $scope.artist});
}

function TrackController($scope, $routeParams, LastFmResource) {

    $scope.artist = $routeParams.artist;

    $scope.tracksResult = LastFmResource.get({op: 'artist.gettoptracks', artist: $scope.artist});
}


function ArtistController($scope, $location, LastFmResource) {

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

    $scope.country = $scope.countries[9];

    $scope.findTopArtists = function () {
        $location.path("/"); //sets up artists template in case it is called with another template in focus
        $scope.artistsResult = LastFmResource.get({op: 'geo.gettopartists', country: $scope.country.name});

    }
}
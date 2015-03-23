var app = angular.module('axagFinance', ['ngResource']);

app.controller('MainCtrl', function($scope, finance) {
  $scope.name = 'World';
  $scope.data = {};
  $scope.data.quand = [];
  console.clear();
  console.log('MainCtrl', Object.keys($scope.data).length);
  $scope.datalangd = function() {
    return Object.keys($scope.data).length;
  };
  $scope.rensaAllt = function() {
    console.log('Rensar allt');
    $scope.data = {};
  };
  $scope.laddaData = function(){
    var q = 'select * from yahoo.finance.quotes where symbol in ("WAVX", "GOOGL")';
    var stock = 'GOOGL';
    finance.getStock(stock).then(function(result){
      $scope.data.tables = result.data;
      console.log('anropar yahoo.finance', result, result.data.query.results.quote);
    });
    //$scope.data.tables = finance.showTables(q).query();
    //$scope.data.tables = finance.showTables('show tables').query();
    //console.log('anropar laddaData', $scope.data);
  };
  $scope.laddaQuandData = function(){
    finance.getQuand().then(function(result){
      $scope.data.quand = result.data;
      console.log('anropar laddaQuandData', result.data);
    });
  };
  $scope.laddaMollyData = function(){
    finance.getSTO('ODD').then(function(result){
      $scope.data.odd = result.data;
      console.log('anropar getSTO', result.data);
    });
  };
});

app.factory('finance', function($resource, $http){
  return {
    verySimpleGet: function(q){
      //return $resource('https://query.yahooapis.com/v1/public/yql?q=show%20tables&diagnostics=true&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys');
      q = encodeURI(q);
      return $http.get('https://query.yahooapis.com/v1/public/yql?q=' + q + '&diagnostics=true&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys&format=json');
    },
    getStock: function(stock){
      //var qStock = 'select * from yahoo.finance.quotes where symbol in ("WAVX", "GOOGL")';
      var qStock = 'select * from yahoo.finance.quotes where symbol in ("'+ stock +'")';
      return $http.get('https://query.yahooapis.com/v1/public/yql',{
        params: {
          q:qStock,
          diagnostics:true,
          env:'store://datatables.org/alltableswithkeys',
          format:'json'
        }
      });
    },
    showTables: function(q) {
      return $resource('https://query.yahooapis.com/v1/public/yql?',{
          q: q,
          diagnostics:true,
          env:'store%3A%2F%2Fdatatables.org%2Falltableswithkeys',
          format: 'json' 
        },
        {
          'query': { method: 'GET' }
        });
    },
    getSTO: function(stock) {
      return $http.get('https://www.quandl.com/api/v1/datasets/GOOG/STO_' + stock + '.json?auth_token=zTQxuX7b2QHjHy6_K_y9');
    },
    getQuand: function() {
      return $http.get('https://www.quandl.com/api/v1/datasets/MD/OMX.json?auth_token=zTQxuX7b2QHjHy6_K_y9');
    }
  };
});

app.directive('tabellen', function(){
  return {
    scope: {
      data: '=',
      columns:'='
    },
    templateUrl: 'templates/t_table.html',
    link: function(scope,element,attrs){
      //scope.columns=['uno','dos'];
      //scope.data = ['1','2'];
      console.log('tabellens linkfn');
      scope.$watch('columns',function(){
        console.log('$watch på columns triggades', scope.columns)
      });
      scope.$watch('data',function(){
        console.log('$watch på data triggades', scope.data)
      });
    }
  }
});

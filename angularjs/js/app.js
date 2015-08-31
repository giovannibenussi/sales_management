/***
Metronic AngularJS App Main Script
***/

var server_url = 'http://localhost:1337'

/* Metronic App */
var MetronicApp = angular.module("MetronicApp", [
    "ui.router",
    "restangular",
    // "ngResource",
    "ui.bootstrap",
    "oc.lazyLoad",
    "ngSanitize",
    "angular-storage",
    "angular-jwt",
    "ngMessages",
]);

MetronicApp.constant("HTTP_RESPONSES", {
    "OK": 200,
    "UNAUTHORIZED": 401,
    "FORBIDDEN": 403,
    "NOT_FOUND": 404,
    "UNPROCESSABLE_ENTITY": 422,
})

// MetronicApp.factory('jwtInterceptor', [function() {
//     var jwtInterceptor = {
//         request: function(config) {
//             config.params = config.params || {}
//             config.params['jwt'] = 'Hola';
//             // config.headers['jwt'] = 'Hola';
// 			console.log(config)
//             return config;
//         }
//     };
//     return jwtInterceptor;
// }]);

/* Configure ocLazyLoader(refer: https://github.com/ocombe/ocLazyLoad) */
MetronicApp.config(['$httpProvider', 'jwtInterceptorProvider', '$ocLazyLoadProvider', function($httpProvider, jwtInterceptorProvider, $ocLazyLoadProvider) {
    // $httpProvider.interceptors.push('jwtInterceptor');
    // $ocLazyLoadProvider.config({
    // 	// global configs go here
    // });

    // jwtInterceptorProvider.tokenGetter = function(config) {
    // 	config.params = config.params || {}
    // 	config.params['jwt'] = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6ImdiZW51c3NpIiwic2FsdCI6IiQyYSQxMCRpT0tteXRVTm9zc0ZZYXVsOWVKcHNlIiwic2FsdF9jb3N0IjoxMCwiY3JlYXRlZEF0IjoiMjAxNS0wOC0yOVQxODo1MjowNi45MTFaIiwidXBkYXRlZEF0IjoiMjAxNS0wOC0yOVQxODo1MjowNi45MTFaIiwiaWQiOjgsImlhdCI6MTQ0MDg3NDMzMCwiZXhwIjoxNDQwODkyMzMwfQ.sEs9KMDmypL5jPRHYiIVB0iqfyfBjdfzrIVOhdFn89M";
    // 	config.params['jwt'] = store.get('jwt');
    // 	return config.params['jwt'];
    // }
    jwtInterceptorProvider.tokenGetter = ['store', '$http', function(store, $http) {
        return store.get('jwt')
    }];
    $httpProvider.interceptors.push('jwtInterceptor');
}]);

/********************************************
 BEGIN: BREAKING CHANGE in AngularJS v1.3.x:
*********************************************/
/**
`$controller` will no longer look for controllers on `window`.
The old behavior of looking on `window` for controllers was originally intended
for use in examples, demos, and toy apps. We found that allowing global controller
functions encouraged poor practices, so we resolved to disable this behavior by
default.

To migrate, register your controllers with modules rather than exposing them
as globals:

Before:

```javascript
function MyController() {
  // ...
}
```

After:

```javascript
angular.module('myApp', []).controller('MyController', [function() {
  // ...
}]);

Although it's not recommended, you can re-enable the old behavior like this:

```javascript
angular.module('myModule').config(['$controllerProvider', function($controllerProvider) {
  // this option might be handy for migrating old apps, but please don't use it
  // in new ones!
  $controllerProvider.allowGlobals();
}]);
**/

//AngularJS v1.3.x workaround for old style controller declarition in HTML
MetronicApp.config(['$controllerProvider', function($controllerProvider) {
    // this option might be handy for migrating old apps, but please don't use it
    // in new ones!
    $controllerProvider.allowGlobals();
}]);

/********************************************
 END: BREAKING CHANGE in AngularJS v1.3.x:
*********************************************/

/* Setup global settings */
MetronicApp.factory('settings', ['$rootScope', function($rootScope) {
    // supported languages
    var settings = {
        layout: {
            pageSidebarClosed: false, // sidebar menu state
            pageBodySolid: false, // solid body color state
            pageAutoScrollOnLoad: 1000 // auto scroll to top on page load
        },
        layoutImgPath: Metronic.getAssetsPath() + 'admin/layout/img/',
        layoutCssPath: Metronic.getAssetsPath() + 'admin/layout/css/'
    };

    $rootScope.settings = settings;

    return settings;
}]);

/* Setup App Main Controller */
MetronicApp.controller('AppController', ['$scope', '$rootScope', function($scope, $rootScope) {
    $scope.$on('$viewContentLoaded', function(e, to) {
        Metronic.initComponents(); // init core components
        //Layout.init(); //  Init entire layout(header, footer, sidebar, etc) on page load if the partials included in server side instead of loading with ng-include directive
    });
}]);

/***
Layout Partials.
By default the partials are loaded through AngularJS ng-include directive. In case they loaded in server side(e.g: PHP include function) then below partial
initialization can be disabled and Layout.init() should be called on page load complete as explained above.
***/

/* Setup Layout Part - Header */
MetronicApp.controller('HeaderController', ['$scope', function($scope) {
    $scope.$on('$includeContentLoaded', function() {
        Layout.initHeader(); // init header
    });
}]);

/* Setup Layout Part - Sidebar */
MetronicApp.controller('SidebarController', ['$scope', function($scope) {
    $scope.$on('$includeContentLoaded', function() {
        Layout.initSidebar(); // init sidebar
    });
}]);

/* Setup Layout Part - Quick Sidebar */
MetronicApp.controller('QuickSidebarController', ['$scope', function($scope) {
    $scope.$on('$includeContentLoaded', function() {
        setTimeout(function() {
            QuickSidebar.init(); // init quick sidebar
        }, 2000)
    });
}]);

/* Setup Layout Part - Theme Panel */
MetronicApp.controller('ThemePanelController', ['$scope', function($scope) {
    $scope.$on('$includeContentLoaded', function() {
        Demo.init(); // init theme panel
    });
}]);

/* Setup Layout Part - Footer */
MetronicApp.controller('FooterController', ['$scope', function($scope) {
    $scope.$on('$includeContentLoaded', function() {
        Layout.initFooter(); // init footer
    });
}]);

/* Setup Rounting For All Pages */
MetronicApp.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
    // Redirect any unmatched url
    $urlRouterProvider.otherwise("/admin/dashboard.html");

    $stateProvider
        .state('login', {
            url: '/login',
            templateUrl: 'partials/login.html',
            controller: 'AuthController',
        })
        .state('admin', {
            url: '/admin',
            templateUrl: 'tpl/index.html',
            controller: 'IndexController',
            abstract: true,
        })
        .state('admin.not_allowed', {
            data: {
                requiresLogin: false,
            },
            url: '/not_allowed',
            templateUrl: 'tpl/not_allowed.html',
            controller: 'IndexController',
        })
        .state('admin.not_found', {
            data: {
                requiresLogin: false,
            },
            url: '/not_found',
            templateUrl: 'tpl/not_found.html',
            controller: 'IndexController',
        })
        .state('admin.index', {
            url: '',
            templateUrl: 'tpl/admin_index.html',
            controller: 'IndexController',
        })
        .state('admin.users', {
            url: '/users',
            templateUrl: 'partials/users/index.html',
            controller: 'UsersController',
            data: {
                requiresLogin: true,
            },
            abstract: true,
        })
        .state('admin.users.list', {
            url: '',
            data: {
                requiresLogin: true,
            },
            templateUrl: 'partials/users/list.html',
            controller: 'UsersController',
        })
        .state('admin.users.new', {
            url: '/new',
            templateUrl: 'partials/users/form.html',
            controller: 'UsersNewController',
        })
        .state('admin.users.edit', {
            url: '/:id/edit',
            templateUrl: 'partials/users/form.html',
            controller: 'UsersEditController'
        })
        // Dashboard
        .state('admin.dashboard', {
            url: "/dashboard.html",
            templateUrl: "views/dashboard.html",
            data: {
                pageTitle: 'Admin Dashboard Template'
            },
            controller: "DashboardController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                        files: [
                            '../../../assets/global/plugins/morris/morris.css',
                            '../../../assets/admin/pages/css/tasks.css',

                            '../../../assets/global/plugins/morris/morris.min.js',
                            '../../../assets/global/plugins/morris/raphael-min.js',
                            '../../../assets/global/plugins/jquery.sparkline.min.js',

                            '../../../assets/admin/pages/scripts/index3.js',
                            '../../../assets/admin/pages/scripts/tasks.js',

                            'js/controllers/DashboardController.js'
                        ]
                    });
                }]
            }
        })
        // AngularJS plugins
        .state('admin.fileupload', {
            url: "/file_upload.html",
            templateUrl: "views/file_upload.html",
            data: {
                pageTitle: 'AngularJS File Upload'
            },
            controller: "GeneralPageController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load([{
                        name: 'angularFileUpload',
                        files: [
                            '../../../assets/global/plugins/angularjs/plugins/angular-file-upload/angular-file-upload.min.js',
                        ]
                    }, {
                        name: 'MetronicApp',
                        files: [
                            'js/controllers/GeneralPageController.js'
                        ]
                    }]);
                }]
            }
        })

    // UI Select
    .state('admin.uiselect', {
        url: "/ui_select.html",
        templateUrl: "views/ui_select.html",
        data: {
            pageTitle: 'AngularJS Ui Select'
        },
        controller: "UISelectController",
        resolve: {
            deps: ['$ocLazyLoad', function($ocLazyLoad) {
                return $ocLazyLoad.load([{
                    name: 'ui.select',
                    insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                    files: [
                        '../../../assets/global/plugins/angularjs/plugins/ui-select/select.min.css',
                        '../../../assets/global/plugins/angularjs/plugins/ui-select/select.min.js'
                    ]
                }, {
                    name: 'MetronicApp',
                    files: [
                        'js/controllers/UISelectController.js'
                    ]
                }]);
            }]
        }
    })

    // UI Bootstrap
    .state('admin.uibootstrap', {
        url: "/ui_bootstrap.html",
        templateUrl: "views/ui_bootstrap.html",
        data: {
            pageTitle: 'AngularJS UI Bootstrap'
        },
        controller: "GeneralPageController",
        resolve: {
            deps: ['$ocLazyLoad', function($ocLazyLoad) {
                return $ocLazyLoad.load([{
                    name: 'MetronicApp',
                    files: [
                        'js/controllers/GeneralPageController.js'
                    ]
                }]);
            }]
        }
    })

    // Tree View
    .state('admin.tree', {
        url: "/tree",
        templateUrl: "views/tree.html",
        data: {
            pageTitle: 'jQuery Tree View'
        },
        controller: "GeneralPageController",
        resolve: {
            deps: ['$ocLazyLoad', function($ocLazyLoad) {
                return $ocLazyLoad.load([{
                    name: 'MetronicApp',
                    insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                    files: [
                        '../../../assets/global/plugins/jstree/dist/themes/default/style.min.css',

                        '../../../assets/global/plugins/jstree/dist/jstree.min.js',
                        '../../../assets/admin/pages/scripts/ui-tree.js',
                        'js/controllers/GeneralPageController.js'
                    ]
                }]);
            }]
        }
    })

    // Form Tools
    .state('admin.formtools', {
        url: "/form-tools",
        templateUrl: "views/form_tools.html",
        data: {
            pageTitle: 'Form Tools'
        },
        controller: "GeneralPageController",
        resolve: {
            deps: ['$ocLazyLoad', function($ocLazyLoad) {
                return $ocLazyLoad.load([{
                    name: 'MetronicApp',
                    insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                    files: [
                        '../../../assets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.css',
                        '../../../assets/global/plugins/bootstrap-switch/css/bootstrap-switch.min.css',
                        '../../../assets/global/plugins/jquery-tags-input/jquery.tagsinput.css',
                        '../../../assets/global/plugins/bootstrap-markdown/css/bootstrap-markdown.min.css',
                        '../../../assets/global/plugins/typeahead/typeahead.css',

                        '../../../assets/global/plugins/fuelux/js/spinner.min.js',
                        '../../../assets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.js',
                        '../../../assets/global/plugins/jquery-inputmask/jquery.inputmask.bundle.min.js',
                        '../../../assets/global/plugins/jquery.input-ip-address-control-1.0.min.js',
                        '../../../assets/global/plugins/bootstrap-pwstrength/pwstrength-bootstrap.min.js',
                        '../../../assets/global/plugins/bootstrap-switch/js/bootstrap-switch.min.js',
                        '../../../assets/global/plugins/jquery-tags-input/jquery.tagsinput.min.js',
                        '../../../assets/global/plugins/bootstrap-maxlength/bootstrap-maxlength.min.js',
                        '../../../assets/global/plugins/bootstrap-touchspin/bootstrap.touchspin.js',
                        '../../../assets/global/plugins/typeahead/handlebars.min.js',
                        '../../../assets/global/plugins/typeahead/typeahead.bundle.min.js',
                        '../../../assets/admin/pages/scripts/components-form-tools.js',

                        'js/controllers/GeneralPageController.js'
                    ]
                }]);
            }]
        }
    })

    // Date & Time Pickers
    .state('admin.pickers', {
        url: "/pickers",
        templateUrl: "views/pickers.html",
        data: {
            pageTitle: 'Date & Time Pickers'
        },
        controller: "GeneralPageController",
        resolve: {
            deps: ['$ocLazyLoad', function($ocLazyLoad) {
                return $ocLazyLoad.load([{
                    name: 'MetronicApp',
                    insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                    files: [
                        '../../../assets/global/plugins/clockface/css/clockface.css',
                        '../../../assets/global/plugins/bootstrap-datepicker/css/datepicker3.css',
                        '../../../assets/global/plugins/bootstrap-timepicker/css/bootstrap-timepicker.min.css',
                        '../../../assets/global/plugins/bootstrap-colorpicker/css/colorpicker.css',
                        '../../../assets/global/plugins/bootstrap-daterangepicker/daterangepicker-bs3.css',
                        '../../../assets/global/plugins/bootstrap-datetimepicker/css/bootstrap-datetimepicker.min.css',

                        '../../../assets/global/plugins/bootstrap-datepicker/js/bootstrap-datepicker.js',
                        '../../../assets/global/plugins/bootstrap-timepicker/js/bootstrap-timepicker.min.js',
                        '../../../assets/global/plugins/clockface/js/clockface.js',
                        '../../../assets/global/plugins/bootstrap-daterangepicker/moment.min.js',
                        '../../../assets/global/plugins/bootstrap-daterangepicker/daterangepicker.js',
                        '../../../assets/global/plugins/bootstrap-colorpicker/js/bootstrap-colorpicker.js',
                        '../../../assets/global/plugins/bootstrap-datetimepicker/js/bootstrap-datetimepicker.min.js',

                        '../../../assets/admin/pages/scripts/components-pickers.js',

                        'js/controllers/GeneralPageController.js'
                    ]
                }]);
            }]
        }
    })

    // Custom Dropdowns
    .state('admin.dropdowns', {
        url: "/dropdowns",
        templateUrl: "views/dropdowns.html",
        data: {
            pageTitle: 'Custom Dropdowns'
        },
        controller: "GeneralPageController",
        resolve: {
            deps: ['$ocLazyLoad', function($ocLazyLoad) {
                return $ocLazyLoad.load([{
                    name: 'MetronicApp',
                    insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                    files: [
                        '../../../assets/global/plugins/bootstrap-select/bootstrap-select.min.css',
                        '../../../assets/global/plugins/select2/select2.css',
                        '../../../assets/global/plugins/jquery-multi-select/css/multi-select.css',

                        '../../../assets/global/plugins/bootstrap-select/bootstrap-select.min.js',
                        '../../../assets/global/plugins/select2/select2.min.js',
                        '../../../assets/global/plugins/jquery-multi-select/js/jquery.multi-select.js',

                        '../../../assets/admin/pages/scripts/components-dropdowns.js',

                        'js/controllers/GeneralPageController.js'
                    ]
                }]);
            }]
        }
    })

    // Advanced Datatables
    .state('admin.datatablesAdvanced', {
        url: "/datatables/advanced.html",
        templateUrl: "views/datatables/advanced.html",
        data: {
            pageTitle: 'Advanced Datatables'
        },
        controller: "GeneralPageController",
        resolve: {
            deps: ['$ocLazyLoad', function($ocLazyLoad) {
                return $ocLazyLoad.load({
                    name: 'MetronicApp',
                    insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                    files: [
                        '../../../assets/global/plugins/select2/select2.css',
                        '../../../assets/global/plugins/datatables/plugins/bootstrap/dataTables.bootstrap.css',
                        '../../../assets/global/plugins/datatables/extensions/Scroller/css/dataTables.scroller.min.css',
                        '../../../assets/global/plugins/datatables/extensions/ColReorder/css/dataTables.colReorder.min.css',

                        '../../../assets/global/plugins/select2/select2.min.js',
                        '../../../assets/global/plugins/datatables/all.min.js',
                        'js/scripts/table-advanced.js',

                        'js/controllers/GeneralPageController.js'
                    ]
                });
            }]
        }
    })

    // Ajax Datetables
    .state('admin.datatablesAjax', {
        url: "/datatables/ajax.html",
        templateUrl: "views/datatables/ajax.html",
        data: {
            pageTitle: 'Ajax Datatables'
        },
        controller: "GeneralPageController",
        resolve: {
            deps: ['$ocLazyLoad', function($ocLazyLoad) {
                return $ocLazyLoad.load({
                    name: 'MetronicApp',
                    insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                    files: [
                        '../../../assets/global/plugins/select2/select2.css',
                        '../../../assets/global/plugins/bootstrap-datepicker/css/datepicker.css',
                        '../../../assets/global/plugins/datatables/plugins/bootstrap/dataTables.bootstrap.css',

                        '../../../assets/global/plugins/bootstrap-datepicker/js/bootstrap-datepicker.js',
                        '../../../assets/global/plugins/select2/select2.min.js',
                        '../../../assets/global/plugins/datatables/all.min.js',

                        '../../../assets/global/scripts/datatable.js',
                        'js/scripts/table-ajax.js',

                        'js/controllers/GeneralPageController.js'
                    ]
                });
            }]
        }
    })

    // User Profile
    .state("admin.profile", {
        url: "/profile",
        templateUrl: "views/profile/main.html",
        data: {
            pageTitle: 'User Profile'
        },
        controller: "UserProfileController",
        resolve: {
            deps: ['$ocLazyLoad', function($ocLazyLoad) {
                return $ocLazyLoad.load({
                    name: 'MetronicApp',
                    insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                    files: [
                        '../../../assets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.css',
                        '../../../assets/admin/pages/css/profile.css',
                        '../../../assets/admin/pages/css/tasks.css',

                        '../../../assets/global/plugins/jquery.sparkline.min.js',
                        '../../../assets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.js',

                        '../../../assets/admin/pages/scripts/profile.js',

                        'js/controllers/UserProfileController.js'
                    ]
                });
            }]
        }
    })

    // User Profile Dashboard
    .state("admin.profile.dashboard", {
        url: "/dashboard",
        templateUrl: "views/profile/dashboard.html",
        data: {
            pageTitle: 'User Profile'
        }
    })

    // User Profile Account
    .state("admin.profile.account", {
        url: "/account",
        templateUrl: "views/profile/account.html",
        data: {
            pageTitle: 'User Account'
        }
    })

    // User Profile Help
    .state("admin.profile.help", {
        url: "/help",
        templateUrl: "views/profile/help.html",
        data: {
            pageTitle: 'User Help'
        }
    })

    // Todo
    .state('admin.todo', {
        url: "/todo",
        templateUrl: "views/todo.html",
        data: {
            pageTitle: 'Todo'
        },
        controller: "TodoController",
        resolve: {
            deps: ['$ocLazyLoad', function($ocLazyLoad) {
                return $ocLazyLoad.load({
                    name: 'MetronicApp',
                    insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                    files: [
                        '../../../assets/global/plugins/bootstrap-datepicker/css/datepicker3.css',
                        '../../../assets/global/plugins/select2/select2.css',
                        '../../../assets/admin/pages/css/todo.css',

                        '../../../assets/global/plugins/bootstrap-datepicker/js/bootstrap-datepicker.js',
                        '../../../assets/global/plugins/select2/select2.min.js',

                        '../../../assets/admin/pages/scripts/todo.js',

                        'js/controllers/TodoController.js'
                    ]
                });
            }]
        }
    })

}]);

/* Init global settings and run the app */
MetronicApp.run(["jwtHelper", "store", "$rootScope", "settings", "$state", function(jwtHelper, store, $rootScope, settings, $state) {
    $rootScope.$state = $state; // state to be accessed from view

    $rootScope.$on('$stateChangeStart', function(e, to) {
        if (to.data && to.data.requiresLogin) {
            Metronic.stopPageLoading();
            if (!store.get('jwt') || jwtHelper.isTokenExpired(store.get('jwt'))) {
                e.preventDefault();
                $state.go('login');
            }
        }
    });
}]);

// MetronicApp.factory('JWTInterceptor', function($q, $location) {
// 	return {
// 		responseError: function(response) {
// 			var status = response.status;
// 			console.log(status)
// 			if (status == 403) {
// 				// $state.go('login');
// 				$location.path('/admin/not_allowed')
// 					// return $q.reject(response);
// 			}
// 		}
// 	};
// });
//
// MetronicApp.config(function($httpProvider) {
// 	$httpProvider.interceptors.push('JWTInterceptor');
// });

MetronicApp.config(function($provide, $httpProvider, HTTP_RESPONSES) {

    // Intercept http calls.
    $provide.factory('MyHttpInterceptor', function($q, $location, $window) {
        return {
            responseError: function(errorResponse) {
                switch (errorResponse.status) {
                    case HTTP_RESPONSES.UNAUTHORIZED:
                        $location.path('/login');
                        break;
                    case HTTP_RESPONSES.FORBIDDEN:
                        $location.path('/admin/not_allowed');
                        break;
                    case HTTP_RESPONSES.NOT_FOUND:
                        $location.path('/admin/not_found');
                        break;
                    case 500:
                        break;
                }
                return $q.reject(errorResponse);
            }
        };
    });

    $httpProvider.interceptors.push('MyHttpInterceptor');
}).run(function(Restangular) {
    Restangular.setBaseUrl(server_url);
})

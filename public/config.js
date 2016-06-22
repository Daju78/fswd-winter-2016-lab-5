System.config({
  baseURL: "/",
  defaultJSExtensions: true,
  transpiler: false,
  paths: {
    "github:*": "jspm_packages/github/*"
  },

  map: {
    "angular": "github:angular/bower-angular@1.5.7",
    "angular-mocks": "github:angular/bower-angular-mocks@1.5.7",
    "angular-route": "github:angular/bower-angular-route@1.5.7",
    "github:angular/bower-angular-mocks@1.5.7": {
      "angular": "github:angular/bower-angular@1.5.7"
    },
    "github:angular/bower-angular-route@1.5.7": {
      "angular": "github:angular/bower-angular@1.5.7"
    }
  }
});

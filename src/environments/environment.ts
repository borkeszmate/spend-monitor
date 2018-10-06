// This file can be replaced during build by using the `fileReplacements` array.
// `ng build ---prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  firebase: {
    apiKey: 'AIzaSyC9Y4cyWAJHr1_02eisUfrulMIgSD1pnuQ',
    authDomain: 'spend-monitor-629f9.firebaseapp.com',
    databaseURL: 'https://spend-monitor-629f9.firebaseio.com',
    projectId: 'spend-monitor-629f9',
    storageBucket: 'spend-monitor-629f9.appspot.com',
    messagingSenderId: '296719070287'
  }
};

/*
 * In development mode, to ignore zone related error stack frames such as
 * `zone.run`, `zoneDelegate.invokeTask` for easier debugging, you can
 * import the following file, but please comment it out in production mode
 * because it will have performance impact when throw error
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.

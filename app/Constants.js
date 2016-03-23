'use strict';

module.exports = {

  Colors: {
    garnet: '#8F001A',
    darkGrey: '#80746C',
    polarGrey: '#F2F2F2',
    lightGrey: '#ACA39A',
    charcoalGrey: '#2D2D2C',
    transparent: 'rgba(0, 0, 0, 0)',
    rootElementBorder: 'rgba(0, 0, 0, 0.25)',
  },

  /*
   * NOTE: When adding a new view here, make sure you also update app/util/ScreenUtils.js
   */
  Views: {
    Default: 100,
    Splash: 1,
    Main: 2,
    Find: {
      Home: 100,
      Building: 101,
      Search: 102,
    },
    Schedule: {
      Home: 200,
      Editor: 201,
    },
    Discover: {
      Home: 300,
    },
    Settings: {
      Home: 400,
    },
  },
};

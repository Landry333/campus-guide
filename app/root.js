'use strict';

// react-native imports
var React = require('react-native');

var {
  Navigator,
  View,
} = React;

// Other imports
var Constants = require('./constants');
var I18n = require('react-native-i18n');
var MainScreen = require('./views/main');
var SplashScreen = require('./views/splash');
var styles = require('./styles');

var CampusGuide = React.createClass({

  _renderScene(route, navigator) {
    if (route.id === Constants.Views.Splash) {
      return <SplashScreen navigator={navigator} />
    } else if (route.id === Constants.Views.Main) {
      return <MainScreen navigator={navigator} />
    }
  },

  _configureScene() {
    return ({
      ...Navigator.SceneConfigs.HorizontalSwipeJump,
      gestures: false,
    });
  },

  render() {
    return (
      <Navigator
          configureScene={this._configureScene}
          initialRoute={{id: 1}}
          renderScene={this._renderScene} />
    );
  },
});

// Setup internationalization
I18n.fallbacks = true;
I18n.defaultLocale = 'en';
require('./util/language/translations');

module.exports = CampusGuide;

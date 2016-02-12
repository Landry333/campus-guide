'use strict';

// react-native imports
var React = require('react-native');

var {
  Alert,
  Navigator,
  StyleSheet,
  View,
} = React;

// Views
var FindHome = require('./find/home');
var SettingsHome = require('./settings/home');
var TabBar = require('../components/tabs');

// Other imports
var buildStyleInterpolator = require('buildStyleInterpolator');
var Constants = require('../constants');
var Preferences = require('../util/preferences');
var styles = require('../styles');
var Translations = require('../util/translations');

var MainScreen = React.createClass({

  _configureScene() {
    // Disable transitions between screens
    var NoTransition = {
      opacity: {
        from: 1,
        to: 1,
        min: 1,
        max: 1,
        type: 'linear',
        extrapolate: false,
        round: 100,
      },
    };

    return  ({
      ...Navigator.SceneConfigs.FadeAndroid,
      gestures: null,
      defaultTransitionVelocity: 100,
      animationInterpolators: {
        into: buildStyleInterpolator(NoTransition),
        out: buildStyleInterpolator(NoTransition),
      },
    });
  },

  _renderScene(route, navigator) {
    return (
      <View style={{flex: 1, backgroundColor: Constants.Colors.garnet}}>
        {route.id === Constants.Views.Find.Home
            ? <FindHome navigator={navigator} />
            : null}
        {route.id === Constants.Views.Buses.Home
            ? <View style={{flex: 1, backgroundColor: Constants.Colors.darkGrey}}></View>
            : null}
        {route.id === Constants.Views.Discover.Home
            ? <View style={{flex: 1, backgroundColor: Constants.Colors.lightGrey}}></View>
            : null}
        {route.id === Constants.Views.Settings.Home
            ? <SettingsHome navigator={navigator} />
            : null}
        <TabBar navigator={navigator} />
      </View>
    );
  },

  componentDidMount() {
    // TODO: consider unlocking orientation (probably won't)
    // Orientation.unlockAllOrientations();
    //Orientation.addOrientationListener(this._orientationDidChange);

    if (Preferences.isFirstTimeOpened()) {
      Alert.alert(
        Translations[Preferences.getSelectedLanguage()]['only_once_title'],
        Translations[Preferences.getSelectedLanguage()]['only_once_message'],
      );
    }
  },

  componentWillUnmount() {
    // TODO: consider unlocking orientation (probably won't)
    //Orientation.removeOrientationListener(this._orientationDidChange);
  },

  render() {
    // TODO: change initial route to Find.Home
    return (
      <View style={_styles.container}>
        <Navigator
            configureScene={this._configureScene}
            initialRoute={{id: Constants.Views.Settings.Home}}
            renderScene={this._renderScene} />
      </View>
    );
  },
});

var _styles = StyleSheet.create({
  container: {
    flex: 1
  }
});

module.exports = MainScreen;

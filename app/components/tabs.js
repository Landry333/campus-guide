'use strict';

var React = require('react-native');
var {
  Animated,
  Dimensions,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} = React;

var Constants = require('../constants');
var styles = require('../styles');

// Icons
var Icon;
var tabIcons;
if (Platform.OS === 'ios') {
  Icon = require('react-native-vector-icons/Ionicons');
  tabIcons = {
    'Find': 'navigate',
    'Schedule': 'ios-calendar-outline',
    'Discover': 'compass',
    'Settings': 'ios-gear',
  };
} else {
  Icon = require('react-native-vector-icons/MaterialIcons');
  tabIcons = {
    'Find': 'directions',
    'Schedule': 'event',
    'Discover': 'near-me',
    'Settings': 'settings',
  };
}

var {height, width} = Dimensions.get('window');
var indicatorWidth = Math.ceil(width / 4);
var indicatorHeight = 5;

var TabBar = React.createClass({
  propTypes: {
    requestTabChange: React.PropTypes.func.isRequired,
  },

  _changeTabs(tab) {
    // Switch to the selected tab
    this.props.requestTabChange(tab);
  },

  getInitialState() {
    return {
      currentTab: Constants.Views.Find.Home,
    };
  },

  render() {
    let findColor = Constants.Colors.charcoalGrey;
    let scheduleColor = Constants.Colors.charcoalGrey;
    let discoverColor = Constants.Colors.charcoalGrey;
    let settingsColor = Constants.Colors.charcoalGrey;
    let indicatorLeft = 0;

    // Set the color of the current tab to garnet
    if (this.state.currentTab === Constants.Views.Find.Home) {
      indicatorLeft = 0;
      findColor = Constants.Colors.garnet;
    } else if (this.state.currentTab === Constants.Views.Schedule.Home) {
      indicatorLeft = indicatorWidth;
      scheduleColor = Constants.Colors.garnet;
    } else if (this.state.currentTab === Constants.Views.Discover.Home) {
      indicatorLeft = indicatorWidth * 2;
      discoverColor = Constants.Colors.garnet;
    } else if (this.state.currentTab === Constants.Views.Settings.Home) {
      indicatorLeft = indicatorWidth * 3;
      settingsColor = Constants.Colors.garnet;
    }

    return (
      <View style={_styles.container}>
        <TouchableOpacity onPress={() => {this._changeTabs(Constants.Views.Find.Home)}} style={_styles.tab}>
          <Icon name={tabIcons['Find']} size={30} color={findColor} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => {this._changeTabs(Constants.Views.Schedule.Home)}} style={_styles.tab}>
          <Icon name={tabIcons['Schedule']} size={30} color={scheduleColor} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => {this._changeTabs(Constants.Views.Discover.Home)}} style={_styles.tab}>
          <Icon name={tabIcons['Discover']} size={30} color={discoverColor} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => {this._changeTabs(Constants.Views.Settings.Home)}} style={_styles.tab}>
          <Icon name={tabIcons['Settings']} size={30} color={settingsColor} />
        </TouchableOpacity>
        <View style={[_styles.indicator, {left: indicatorLeft}]} />
      </View>
    )
  },
});

var _styles = StyleSheet.create({
  container: {
    height: 50,
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: Constants.Colors.rootElementBorder,
    backgroundColor: Constants.Colors.polarGrey,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  indicator: {
    position: 'absolute',
    bottom: 0,
    width: indicatorWidth,
    height: indicatorHeight,
    backgroundColor: Constants.Colors.garnet,
  }
});

module.exports = TabBar;

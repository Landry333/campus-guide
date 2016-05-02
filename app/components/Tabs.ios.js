/**
 *
 * @license
 * Copyright (C) 2016 Joseph Roque
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @file
 * Tabs.js
 *
 * @description
 * Tab bar to manage navigation between the root views in the application.
 *
 * @author
 * Joseph Roque
 *
 * @external
 * @flow
 *
 */
'use strict';

// React Native imports
const React = require('react-native');
const {
  Component,
  Dimensions,
  Navigator,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} = React;

// Import type definition for tab icons.
import type {
  TabIcons,
} from '../Types';

// Imports
const Constants = require('../Constants');
const ScreenUtils = require('../util/ScreenUtils');

// Screen imports
const BusCampuses = require('../views/discover/BusCampuses');
const BusCampusStops = require('../views/discover/BusCampusStops');
const DetailsScreen = require('./DetailsScreen');
const DiscoverHome = require('../views/discover/DiscoverHome');
const FindHome = require('../views/find/FindHome');
const LinkCategory = require('../views/discover/LinkCategory');
const LinksHome = require('../views/discover/LinksHome');
const ScheduleHome = require('../views/schedule/ScheduleHome');
const ScheduleEditor = require('../views/schedule/ScheduleEditor');
const SettingsHome = require('../views/settings/SettingsHome');
const ShuttleCampusInfo = require('../views/discover/ShuttleCampusInfo');
const ShuttleInfo = require('../views/discover/ShuttleInfo');

let Icon: ReactClass = require('react-native-vector-icons/Ionicons');
let tabIcons: TabIcons = {
  find: 'navigate',
  schedule: 'ios-calendar-outline',
  discover: 'compass',
  settings: 'ios-gear',
};

// Determining the size of the current tab indicator based on the screen size
const {height, width} = Dimensions.get('window');
const indicatorWidth: number = Math.ceil(width / 4);
const tabIconSize: number = 30;

// Lists the views currently on the stack in the Navigator.
let screenStack: Array<number | string> = [Constants.Views.Default];

// Type definition for component props.
type Props = {
  refreshParent: () => any,
  showBackButton: (show: boolean) => any,
};

// Type definition for component state.
type State = {
  currentTab: number,
};

// Type definition for navigator routes
type Route = {
  id: number | string,
  data: any,
};

class TabsView extends Component {
  state: State;

  /**
   * Properties which the parent component should make available to this
   * component.
   */
  static propTypes = {
    refreshParent: React.PropTypes.func.isRequired,
    showBackButton: React.PropTypes.func.isRequired,
  };

  /**
   * Pass props and declares initial state.
   *
   * @param {Props} props properties passed from container to this component.
   */
  constructor(props: Props) {
    super(props);
    this.state = {
      currentTab: Constants.Views.DefaultTab,
    };

    // Explicitly binding 'this' to all methods that need it
    (this:any).getCurrentTab = this.getCurrentTab.bind(this);
    (this:any).navigateBack = this.navigateBack.bind(this);
    (this:any)._changeTabs = this._changeTabs.bind(this);
    (this:any)._navigateForward = this._navigateForward.bind(this);
    (this:any)._renderScene = this._renderScene.bind(this);
  };

  /**
   * Retrieves the current tab.
   *
   * @return {number} the current tab in the state.
   */
  getCurrentTab(): number {
    return this.state.currentTab;
  };

  /**
   * Returns to the previous page.
   */
  navigateBack(): void {
    if (!ScreenUtils.isRootScreen(screenStack[screenStack.length - 1])) {
      this.refs.Navigator.pop();
      screenStack.pop();

      if (ScreenUtils.isRootScreen(screenStack[screenStack.length - 1])) {
        this.props.showBackButton(false);
      }
    }
  };

  /**
   * Switch to the selected tab, as determined by tabId.
   *
   * @param {number} tabId the tab to switch to.
   */
  _changeTabs(tabId: number) {
    if (!ScreenUtils.isRootScreen(screenStack[screenStack.length - 1])) {
      this.props.showBackButton(false);
    }

    this.refs.Navigator.resetTo({id: tabId});
    this.setState({
      currentTab: tabId,
    })
    screenStack = [tabId];
  };

  /**
   * Sets the transition between two views in the navigator.
   *
   * @return {Object} a configuration for the transition between scenes.
   */
  _configureScene(): Object {
    return Navigator.SceneConfigs.PushFromRight;
  };

  /**
   * Returns the current screen being displayed, or 0 if there isn't one.
   *
   * @return {number | string} the screen at the top of {screenStack}, or 0.
   */
  _getCurrentScreen(): number | string {
    if (screenStack !== null && screenStack.length > 0) {
      return screenStack[screenStack.length - 1]
    } else {
      return 0;
    }
  }

  /**
   * Opens a screen, unless the screen is already showing. Passes data to
   * the new screen.
   *
   * @param {number | string} screenId  id of the screen to display
   * @param {Object} data     optional parameters to pass to the renderScene method.
   */
  _navigateForward(screenId: number | string, data: any): void {
    if (this._getCurrentScreen() === screenId) {
      // Don't push the screen if it's already showing.
      return;
    }

    // Show a back button to return to the previous screen, if the screen
    // is not a home screen
    if (ScreenUtils.isRootScreen(this._getCurrentScreen())) {
      this.props.showBackButton(true);
    }

    this.refs.Navigator.push({id: screenId, data: data});
    screenStack.push(screenId);
  };

  /**
   * Renders a view according to the current route of the navigator.
   *
   * @param {Route} route         object with properties to identify the route to display.
   * @param {ReactClas} navigator navigator object to pass to children.
   * @return {ReactElement} the view to render, based on {route}.
   */
  _renderScene(route: Route, navigator: ReactClass): ReactElement {
    let scene = null;
    if (route.id === Constants.Views.Find.Home) {
      scene = (
        <FindHome
            onEditSchedule={() => this._changeTabs(Constants.Views.Schedule.Home)}
            onShowBuilding={(buildingCode) => this._navigateForward(Constants.Views.Find.Building, buildingCode)} />
      );
    } else if (route.id === Constants.Views.Schedule.Home) {
      scene = (
        <ScheduleHome
            requestTabChange={this._changeTabs}
            editSchedule={() => this._navigateForward(Constants.Views.Schedule.Editor)} />
      );
    } else if (route.id === Constants.Views.Schedule.Editor) {
      scene = (
        <ScheduleEditor />
      );
    } else if (route.id === Constants.Views.Discover.Home) {
      scene = (
        <DiscoverHome onScreenSelected={this._navigateForward} />
      );
    } else if (route.id === Constants.Views.Discover.BusCampuses) {
      scene = (
        <BusCampuses
            showCampus={(campusName, campusColor) => this._navigateForward(Constants.Views.Discover.BusCampusStops, {name: campusName, color: campusColor})} />
      );
    } else if (route.id === Constants.Views.Discover.BusCampusStops) {
      scene = (
        <BusCampusStops campusName={route.data.name} campusColor={route.data.color} />
      );
    } else if (route.id === Constants.Views.Discover.LinksHome) {
      scene = (
        <LinksHome showLinkCategory={(category) => this._navigateForward(Constants.Views.Discover.LinkCategory + '-0', {category: category, categoryImage: category.image, index: 0})} />
      );
    } else if (route.id === Constants.Views.Discover.ShuttleInfo) {
      scene = (
        <ShuttleInfo
            showCampus={(campusName, campusColor) => this._navigateForward(Constants.Views.Discover.ShuttleCampusInfo, {name: campusName, color: campusColor})}
            showDetails={(title, image, text, backgroundColor) => this._navigateForward(Constants.Views.Discover.ShuttleDetails, {title: title, image: image, text: text, backgroundColor: backgroundColor})}/>
      );
    } else if (route.id === Constants.Views.Discover.ShuttleCampusInfo) {
      scene = (
        <ShuttleCampusInfo
            campusName={route.data.name}
            campusColor={route.data.color} />
      );
    } else if (route.id === Constants.Views.Settings.Home) {
      scene = (
        <SettingsHome requestTabChange={this._changeTabs} refreshParent={this.props.refreshParent} />
      );
    } else if (route.id === Constants.Views.Discover.ShuttleDetails) {
      scene = (
        <DetailsScreen
            title={route.data.title}
            image={route.data.image}
            text={route.data.text}
            backgroundColor={route.data.backgroundColor} />
      );
    } else if (typeof(route.id) === 'string' && route.id.indexOf(Constants.Views.Discover.LinkCategory + '-') === 0) {
      scene = (
        <LinkCategory
            category={route.data.category}
            categoryImage={route.data.categoryImage}
            showLinkCategory={(category) => this._navigateForward(Constants.Views.Discover.LinkCategory + '-' + (route.data.index + 1), {category: category, categoryImage: route.data.categoryImage, index: route.data.index + 1})} />
      );
    }

    return (
      <View style={{flex: 1, backgroundColor: Constants.Colors.garnet}}>
        {scene}
      </View>
    );
  };

  /**
   * Renders the app tabs and icons, an indicator to show the current tab, and a navigator with the tab contents.
   *
   * @return {ReactElement} the hierarchy of views to render.
   */
  render() {
    let findColor = Constants.Colors.charcoalGrey;
    let scheduleColor = Constants.Colors.charcoalGrey;
    let discoverColor = Constants.Colors.charcoalGrey;
    let settingsColor = Constants.Colors.charcoalGrey;
    let indicatorLeft = 0;

    // Set the color of the current tab to garnet
    switch (this.state.currentTab) {
      case Constants.Views.Find.Home:
        indicatorLeft = 0;
        findColor = Constants.Colors.garnet;
        break;
      case Constants.Views.Schedule.Home:
        indicatorLeft = indicatorWidth;
        scheduleColor = Constants.Colors.garnet;
        break;
      case Constants.Views.Discover.Home:
        indicatorLeft = indicatorWidth * 2;
        discoverColor = Constants.Colors.garnet;
        break;
      case Constants.Views.Settings.Home:
        indicatorLeft = indicatorWidth * 3;
        settingsColor = Constants.Colors.garnet;
        break;
    }

    return (
      <View style={_styles.container}>
        <Navigator
            style={_styles.navigator}
            ref='Navigator'
            configureScene={this._configureScene}
            initialRoute={{id: Constants.Views.Default}}
            renderScene={this._renderScene} />
        <View style={_styles.tabContainer}>
          <TouchableOpacity onPress={() => {this._changeTabs(Constants.Views.Find.Home)}} style={_styles.tab}>
            <Icon name={tabIcons.find} size={tabIconSize} color={findColor} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => {this._changeTabs(Constants.Views.Schedule.Home)}} style={_styles.tab}>
            <Icon name={tabIcons.schedule} size={tabIconSize} color={scheduleColor} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => {this._changeTabs(Constants.Views.Discover.Home)}} style={_styles.tab}>
            <Icon name={tabIcons.discover} size={tabIconSize} color={discoverColor} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => {this._changeTabs(Constants.Views.Settings.Home)}} style={_styles.tab}>
            <Icon name={tabIcons.settings} size={tabIconSize} color={settingsColor} />
          </TouchableOpacity>
          <View style={[_styles.indicator, {left: indicatorLeft}]} />
        </View>
      </View>
    );
  };
};

// Private styles for component
const _styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  navigator: {
    flex: 1,
  },
  tabContainer: {
    height: 60,
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
    height: 5,
    backgroundColor: Constants.Colors.garnet,
  }
});

// Expose component to app
module.exports = TabsView;

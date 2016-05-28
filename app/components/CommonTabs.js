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
 * @author Joseph Roque
 * @file CommonTabs.js
 * @module CommonTabs
 * @description Provides tab functionality common to both Android and iOS.
 * @flow
 *
 */
'use strict';

// React Native imports
import React from 'react';
import {
  Navigator,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';

// Import type definitions.
import type {
  Route,
  TabItems,
} from '../Types';

// Imports
const Constants = require('../Constants');
const Ionicons = require('react-native-vector-icons/Ionicons');
const NavBar = require('./NavBar');
const ScreenUtils = require('../util/ScreenUtils');
const SearchManager = require('../util/SearchManager');
const TabRouter = require('./TabRouter');

// Lists the views currently on the stack in the Navigator.
let screenStack: Array<number | string> = [Constants.Views.Default];

// Type definition for component state.
type State = {
  currentTab: number,
};

class CommonTabs extends React.Component {
  state: State;

  // Screen which a tab should open
  tabScreens: TabItems = {
    find: Constants.Views.Find.Home,
    schedule: Constants.Views.Schedule.Home,
    discover: Constants.Views.Discover.Home,
    settings: Constants.Views.Settings.Home,
  };

  /**
   * Pass props and declares initial state.
   *
   * @param {{}} props properties passed from container to this component.
   */
  constructor(props: {}) {
    super(props);
    this.state = {
      currentTab: Constants.Views.DefaultTab,
    };

    // Explicitly binding 'this' to all methods that need it
    (this:any).getCurrentTab = this.getCurrentTab.bind(this);
    (this:any)._searchAll = this._searchAll.bind(this);
  }

  /**
   * Registers a default search listener.
   */
  componentDidMount(): void {
    SearchManager.setDefaultSearchListener({
      onSearch: this._searchAll,
    });
  }

  /**
   * Removes the default search listener.
   */
  componentWillUnmount(): void {
    SearchManager.setDefaultSearchListener(null);
  }

  /**
   * Retrieves the current tab.
   *
   * @returns {number} the current tab in the state.
   */
  getCurrentTab(): number {
    return this.state.currentTab;
  }

  /**
   * Switch to the selected tab, as determined by tabId.
   *
   * @param {number} tabId the tab to switch to.
   */
  _changeTabs(tabId: number): void {
    if (!ScreenUtils.isRootScreen(screenStack[screenStack.length - 1])) {
      this._showBackButton(false);
    }

    this.refs.Navigator.resetTo({id: tabId});
    this.setState({
      currentTab: tabId,
    });
    screenStack = [tabId];
  }

  /**
   * Sets the transition between two views in the navigator.
   *
   * @returns {Object} a configuration for the transition between scenes.
   */
  _configureScene(): Object {
    return Navigator.SceneConfigs.PushFromRight;
  }

  /**
   * Returns the current screen being displayed, or 0 if there isn't one.
   *
   * @returns {number | string} the screen at the top of {screenStack}, or 0.
   */
  _getCurrentScreen(): number | string {
    if (screenStack !== null && screenStack.length > 0) {
      return screenStack[screenStack.length - 1];
    } else {
      return 0;
    }
  }

  /**
   * Returns to the previous page.
   *
   * @returns {boolean} true if the app navigated backwards.
   */
  _navigateBack(): boolean {
    if (!ScreenUtils.isRootScreen(screenStack[screenStack.length - 1])) {
      this.refs.Navigator.pop();
      screenStack.pop();

      if (ScreenUtils.isRootScreen(screenStack[screenStack.length - 1])) {
        this._showBackButton(false);
      }

      return true;
    }

    return false;
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
      // TODO: change the search terms if screenId === Constants.Views.Find.Search
      return;
    }

    // Show a back button to return to the previous screen, if the screen
    // is not a home screen
    if (ScreenUtils.isRootScreen(this._getCurrentScreen())) {
      this._showBackButton(true);
    }

    this.refs.Navigator.push({id: screenId, data: data});
    screenStack.push(screenId);
  }

  /**
   * Passes search params onto search listeners, or the default search listener if there are no others.
   *
   * @param {string} searchTerms string of terms to search for.
   */
  _onSearch(searchTerms: string): void {
    const numberOfSearchListeners = SearchManager.numberOfSearchListeners();
    if (numberOfSearchListeners > 0) {
      for (let i = 0; i < numberOfSearchListeners; i++) {
        SearchManager.getSearchListener(i).onSearch(searchTerms);
      }
    } else {
      if (SearchManager.getDefaultSearchListener() != null) {
        SearchManager.getDefaultSearchListener().onSearch(searchTerms);
      }
    }
  }

  /**
   * Forces the navbar to be re-rendered.
   */
  _refreshNavbar(): void {
    this.refs.NavBar.setState({refresh: !this.refs.NavBar.getRefresh()});
  }

  /**
   * Renders a view according to the current route of the navigator.
   *
   * @param {Route} route object with properties to identify the route to display.
   * @returns {ReactElement} the view to render, based on {route}.
   */
  _renderScene(route: Route): ReactElement {
    return TabRouter.renderScene(route,
        this._changeTabs.bind(this),
        this._navigateForward.bind(this),
        this._refreshNavbar.bind(this));
  }

  /**
   * Searches all components of the app and displays the results.
   *
   * @param {string} searchTerms string of terms to search for.
   */
  _searchAll(searchTerms: string): void {
    // TODO: search...
    console.log('TODO: search...');
    this._navigateForward.bind(this, Constants.Views.Find.Search, searchTerms);
  }

  /**
   * Shows or hides the back button in the navbar.
   *
   * @param {boolean} show true to show back button, false to hide
   */
  _showBackButton(show: boolean): void {
    this.refs.NavBar.setState({
      showBackButton: show,
    });
  }
};

// Expose component to app
module.exports = CommonTabs;

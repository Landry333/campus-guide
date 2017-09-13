/**
 *
 * @license
 * Copyright (C) 2016-2017 Joseph Roque
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
 * @created 2016-10-12
 * @file TabView.tsx
 * @description Manages the application's tabs and the user's navigation.
 */
'use strict';

// Imports
import * as Constants from '../constants';
import { NavigationRouteConfigMap, TabNavigator } from 'react-navigation';

// Tabs
import Discover from './discover/Discover';
import Find from './find/Find';
import Schedule from './schedule/Schedule';
import Search from './search/SearchView';
import Settings from './settings/Settings';

// Types
import { Tab } from '../../typings/global';

/**
 * Return the relevant container element for the given tab.
 *
 * @param {Tab} tab a tab name
 * @returns {JSX.Element} a JSX.Element tab container
 */
function getTabScreen(tab: Tab): JSX.Element {
  switch (tab) {
    case 'discover': return Discover;
    case 'find': return Find;
    case 'schedule': return Schedule;
    case 'search': return Search;
    case 'settings': return Settings;
    default: throw new Error(`Unexpected tab name: ${tab}`);
  }
}

const routeMap: NavigationRouteConfigMap = {};
for (const tab of Constants.Tabs) {
  routeMap[tab] = {
    path: tab,
    screen: getTabScreen(tab),
  };
}

const TabView = TabNavigator(
  routeMap,
  {
    initialRouteName: Constants.Tabs[0],
    swipeEnabled: false,
  }
);

export default TabView;

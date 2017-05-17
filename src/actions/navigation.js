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
 * @created 2016-10-08
 * @file navigation.js
 * @description Provides navigation actions.
 *
 * @flow
 */
'use strict';

// Types
import type { MenuSection, Tab } from 'types';
import {
  NAVIGATE_BACK,
  SET_CAN_BACK,
  SWITCH_TAB,
  SWITCH_FIND_VIEW,
  SWITCH_DISCOVER_VIEW,
  SWITCH_DISCOVER_LINK,
  SWITCH_DISCOVER_TRANSIT_CAMPUS,
} from 'actionTypes';

module.exports = {

  canNavigateBack: (key: string, can: boolean) => ({
    type: SET_CAN_BACK,
    key,
    can,
  }),

  navigateBack: () => ({
    type: NAVIGATE_BACK,
  }),

  switchTab: (tab: Tab) => ({
    type: SWITCH_TAB,
    tab,
  }),

  switchFindView: (view: number) => ({
    type: SWITCH_FIND_VIEW,
    view,
  }),

  switchDiscoverView: (view: number) => ({
    type: SWITCH_DISCOVER_VIEW,
    view,
  }),

  switchLinkCategory: (linkId: ?string | number) => ({
    type: SWITCH_DISCOVER_LINK,
    linkId,
  }),

  switchTransitCampus: (campus: ?MenuSection) => ({
    type: SWITCH_DISCOVER_TRANSIT_CAMPUS,
    campus,
  }),

};

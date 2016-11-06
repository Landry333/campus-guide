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
 * @created 2016-10-27
 * @file discover.js
 * @description Reducers for discover actions
 *
 * @flow
 */
'use strict';

// Types
import type {
  Action,
  Campus,
  LinkSection,
  DiscoverSection,
} from 'types';

// Describes the discover state.
type State = {
  campus: ?Campus,                      // Selected bus campus to display info for
  links: Array < LinkSection >,         // Sections of useful links
  sections: Array < DiscoverSection >,  // Sections of info about the university
  view: number,                         // Current view to display in the Discover navigator
};

// Initial discover state.
const initialState: State = {
  campus: null,
  links: [],
  sections: [],
  view: 0,
};

/**
 * When provided with a discover action, parses the parameters and returns an updated state.
 *
 * @param {State}  state  the current state
 * @param {Action} action the action being taken
 * @returns {State} an updated state based on the previous state and the action taken.
 */
function discover(state: State = initialState, action: Action): State {
  switch (action.type) {
    case 'DISCOVER_VIEW':
      return {
        ...state,
        view: action.view,
      };
    case 'SET_DISCOVER_SECTIONS':
      return {
        ...state,
        sections: action.sections,
      };
    case 'SET_DISCOVER_LINKS':
      return {
        ...state,
        links: action.links,
      };
    case 'SHOW_BUSES':
      return {
        ...state,
        campus: action.campus,
      };
    default:
      return state;
  }
}

module.exports = discover;

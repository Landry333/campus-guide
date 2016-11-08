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
 * @created 2016-10-18
 * @file navigation-test.js
 * @description Tests navigation reducers
 *
 */
'use strict';

// Imports
import reducer from '../navigation';

// Expected initial state
const initialState = {
  backNavigations: 0,
  tab: 'find',
};

describe('navigation reducer', () => {
  it('should return the initial state', () => {
    expect(reducer(undefined, {})).toEqual(initialState);
  });

  it('should switch to a new tab', () => {
    expect(
      reducer(
        initialState,
        {
          type: 'SWITCH_TAB',
          tab: 'schedule',
        }
      )
    ).toEqual(
      {
        ...initialState,
        tab: 'schedule',
      }
    );
  });

  it('should increase the back navigations', () => {
    expect(
      reducer(
        initialState,
        {
          type: 'NAVIGATE_BACK',
        }
      )
    ).toEqual(
      {
        ...initialState,
        backNavigations: 1,
      }
    );
  });
});

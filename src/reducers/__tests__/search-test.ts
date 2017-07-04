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
 * @file search-test.ts
 * @description Tests search reducers
 *
 */
'use strict';

// Imports
import { default as reducer, State } from '../search';

// Types
import * as Actions from '../../actionTypes';

// Expected initial state
const initialState: State = {
  studyFilters: new Set(),
  terms: undefined,
};

describe('search reducer', () => {

  it('should return the initial state', () => {
    expect(reducer(undefined, {})).toEqual(initialState);
  });

  it('should perform a set of searches', () => {
    const testTerms = 'search';
    const otherTerms = 'other_search';

    expect(reducer(initialState, { type: Actions.Search.Search, terms: testTerms }))
        .toEqual({ ...initialState, terms: testTerms });

    expect(reducer(initialState, { type: Actions.Search.Search, terms: otherTerms }))
        .toEqual({ ...initialState, terms: otherTerms });

    expect(reducer(initialState, { type: Actions.Search.Search, terms: undefined }))
        .toEqual({ ...initialState, terms: undefined });
  });

  it('should set new filters', () => {
    const filters = new Set();
    filters.add('filter1');
    filters.add('filter2');

    const updatedState = reducer(initialState, {
      filters: [ 'filter1', 'filter2' ],
      type: Actions.Search.SetStudyFilters,
    });
    expect(updatedState.studyFilters).not.toBeNull();
    expect(updatedState.studyFilters.size).toBe(2);
    expect(updatedState.studyFilters.has('filter1')).toBeTruthy();
    expect(updatedState.studyFilters.has('filter2')).toBeTruthy();
  });

  it('should activate new filters', () => {
    let updatedState = reducer(initialState, { type: Actions.Search.ActivateStudyFilter, filter: 'filter1' });
    expect(updatedState.studyFilters).not.toBeNull();
    expect(updatedState.studyFilters.size).toBe(1);
    expect(updatedState.studyFilters.has('filter1')).toBeTruthy();

    updatedState = reducer(updatedState, { type: Actions.Search.ActivateStudyFilter, filter: 'filter2' });
    expect(updatedState.studyFilters).not.toBeNull();
    expect(updatedState.studyFilters.size).toBe(2);
    expect(updatedState.studyFilters.has('filter1')).toBeTruthy();
    expect(updatedState.studyFilters.has('filter2')).toBeTruthy();
  });

  it('should deactivate filters', () => {
    let updatedState = reducer(initialState, { type: Actions.Search.ActivateStudyFilter, filter: 'filter1' });
    expect(updatedState.studyFilters).not.toBeNull();
    expect(updatedState.studyFilters.size).toBe(1);
    expect(updatedState.studyFilters.has('filter1')).toBeTruthy();

    updatedState = reducer(updatedState, { type: Actions.Search.ActivateStudyFilter, filter: 'filter2' });
    updatedState = reducer(updatedState, { type: Actions.Search.ActivateStudyFilter, filter: 'filter3' });

    updatedState = reducer(updatedState, { type: Actions.Search.DeactivateStudyFilter, filter: 'filter2' });
    expect(updatedState.studyFilters).not.toBeNull();
    expect(updatedState.studyFilters.size).toBe(2);
    expect(updatedState.studyFilters.has('filter1')).toBeTruthy();
    expect(updatedState.studyFilters.has('filter2')).toBeFalsy();
    expect(updatedState.studyFilters.has('filter3')).toBeTruthy();
  });
});

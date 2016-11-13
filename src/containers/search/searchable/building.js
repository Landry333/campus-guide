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
 * @created 2016-11-6
 * @file building.js
 * @description Describes how buildings in the app should be searched.
 *
 * @flow
 */
'use strict';

// React imports
import {
  Platform,
} from 'react-native';

// Type imports
import type {
  Building,
  Language,
  RoomType,
} from 'types';

import type {
  SearchResult,
} from '../Searchable';

// Imports
import Promise from 'promise';
import * as Configuration from 'Configuration';
import * as DisplayUtils from 'DisplayUtils';
import * as TranslationUtils from 'TranslationUtils';

/**
 * Returns a promise containing a list of buildings which match the search terms.
 *
 * @param {Language}        language    the current language
 * @param {string}          searchTerms the search terms for the query
 * @param {Array<Building>} buildings   list of buildings
 * @returns {Promise<Object>} promise which resolves with the results of the search, containing buildings
 */
function _getBuildingResults(language: Language,
                             searchTerms: string,
                             buildings: Array < any >): Promise < Array < SearchResult > > {

  /* TODO: replace buildings: Array < any > with buildings: Array < Building > */

  return new Promise((resolve) => {
    const results: Array < SearchResult > = [];

    for (let i = 0; i < buildings.length; i++) {
      const translated: boolean = !('name' in buildings[i]);
      const name: string = TranslationUtils.getTranslatedName(language, buildings[i]) || '';
      const matchedTerms: Array < string > = [];

      // Compare building properties to search terms to add to results
      if (!translated && buildings[i].name.toUpperCase().indexOf(searchTerms) >= 0) {
        matchedTerms.push(buildings[i].name.toUpperCase());
      } else if (translated &&
          (buildings[i].name_en.toUpperCase().indexOf(searchTerms) >= 0
          || buildings[i].name_fr.toUpperCase().indexOf(searchTerms) >= 0)) {
        matchedTerms.push(buildings[i].name_fr.toUpperCase());
        matchedTerms.push(buildings[i].name_en.toUpperCase());
      }

      if (buildings[i].code.toUpperCase().indexOf(searchTerms) >= 0) {
        matchedTerms.push(buildings[i].code.toUpperCase());
      }

      if (matchedTerms.length > 0) {
        results.push({
          description: name,
          icon: {
            name: 'store',
            class: 'material',
          },
          matchedTerms: matchedTerms,
          title: buildings[i].code,
        });
      }
    }

    resolve(results);
  });
}

/**
 * Returns a promise containing a list of rooms which match the search terms.
 *
 * @param {Language}        language    the current language
 * @param {string}          searchTerms the search terms for the query.
 * @param {Array<Building>} buildings   list of buildings
 * @returns {Promise<Object>} promise which resolves with the results of the search, containing rooms
 */
function _getRoomResults(language: Language,
                         searchTerms: string,
                         buildings: Array < Building >): Promise < Array < SearchResult > > {
  return new Promise((resolve, reject) => {
    Configuration.init()
        .then(() => Configuration.getConfig('/room_types.json'))
        .then((roomTypes: Array < RoomType >) => {
          const results: Array < SearchResult > = [];

          for (let i = 0; i < buildings.length; i++) {
            // Search the rooms in the building and add them to results
            for (let j = 0; j < buildings[i].rooms.length; j++) {
              const room = buildings[i].rooms[j];
              if (room.name.toUpperCase().indexOf(searchTerms) >= 0) {
                const description = TranslationUtils.getTranslatedName(language, roomTypes[room.type]) || '';
                const title = TranslationUtils.getTranslatedName(language, buildings[i]) || '';
                const icon = DisplayUtils.getPlatformIcon(Platform.OS, roomTypes[room.type]);

                results.push({
                  description: description,
                  icon: icon || {name: 'search', class: 'material'},
                  matchedTerms: [room.name.toUpperCase()],
                  title: title + ' > ' + room.name,
                });
              }
            }
          }

          resolve(results);
        })
        .catch((err: any) => reject(err));
  });
}

/**
 * Returns a promise containing a list of buildings and rooms which match the search terms.
 *
 * @param {Language} language    the current language
 * @param {?string}  searchTerms the search terms for the query.
 * @returns {Promise<Object>} promise which resolves with the results of the search, containing buildings and rooms
 */
export function getResults(language: Language, searchTerms: ?string): Promise < Object > {
  return new Promise((resolve, reject) => {
    if (searchTerms == null || searchTerms.length === 0) {
      resolve({});
      return;
    }

    // Ignore the case of the search terms
    const adjustedSearchTerms: string = searchTerms.toUpperCase();
    const buildings: Array < Building > = require('../../../../assets/js/Buildings');

    // Get current language for translations
    const Translations: Object = TranslationUtils.getTranslations(language);

    Promise.all([
      _getBuildingResults(language, adjustedSearchTerms, buildings),
      _getRoomResults(language, adjustedSearchTerms, buildings),
    ])
        .then((results: Array < Object >) => {
          const sections = {};
          sections[Translations.buildings] = results[0];
          sections[Translations.rooms] = results[1];

          resolve(sections);
        })
        .catch((err: any) => reject(err));
  });
}

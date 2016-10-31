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
 * @created 2016-10-09
 * @file Database.js
 * @providesModule Database
 * @description Provides interations with the application database.
 *
 * @flow
 */
'use strict';

// Type imports
import type {
  ConfigFile,
} from 'types';

// Imports
import Promise from 'promise';
import * as ArrayUtils from 'ArrayUtils';
import * as store from 'react-native-simple-store';

/** Identifier for storing Configuration file versions.  */
const STORE_CONFIG_VERSIONS = 'configFiles';

/**
 * Gets a list of config files and their versions from the database.
 *
 * @returns {Promise<Array<ConfigFile>>} a promise which resolves with a list of config file names and versions, or null
 */
export function getConfigVersions(): Promise < Array < ConfigFile > > {
  return store.get(STORE_CONFIG_VERSIONS)
      .then((configVersions) => {
        return ArrayUtils.sortObjectArrayByKeyValues(configVersions, 'name');
      });
}

/**
 * Update versions in the database for config files provided.
 *
 * @param {ConfigFile} update set of config files and versions
 * @returns {Promise<void>} promise which resolves when all updates have finished
 */
export function updateConfigVersions(update: Array < ConfigFile >): Promise < void > {
  return store.get(STORE_CONFIG_VERSIONS)
      .then((original: Array < ConfigFile >) => {
        let final = update;

        if (original != null) {
          const sorted = ArrayUtils.sortObjectArrayByKeyValues(original, 'name');

          // Replace any config versions that should be updated
          for (let i = 0; i < update.length; i++) {
            const index = ArrayUtils.searchObjectArrayByKeyValue(sorted, 'name', update[i].name);
            if (index >= 0) {
              sorted.splice(index, 1);
            }
          }

          final = final.concat(sorted);
        }

        // Save the updated config files
        return store.save(STORE_CONFIG_VERSIONS, final);
      });
}

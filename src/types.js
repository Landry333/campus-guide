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
 * @created 2016-10-05
 * @file types.js
 * @providesModule types
 * @description Type definitions for use throughout the application
 *
 * @flow
 */
'use strict';

//-----------------------------------------------------------------------------
//  General
//-----------------------------------------------------------------------------

/** A function with no parameters and no return type. */
export type VoidFunction = () => void;

/** A name, valid in English or French. */
export type Name = {name: string};

/** A name, translated for English and French. */
export type TranslatedName = {name_en: string, name_fr: string};

/** A link, valid in English or French. */
export type Link = {link: string};

/** A link, translated for English and French. */
export type TranslatedLink = {link_en: string, link_fr: string};

/** A set of details, valid in English or French. */
export type Details = {details: Array < string >};

/** A set of details, translated for English and French. */
export type TranslatedDetails = {details_en: Array < string >, details_fr: Array < string >};

//-----------------------------------------------------------------------------
//  Icons
//-----------------------------------------------------------------------------

/** Available classes for icons to be from. */
export type IconClass =
    'material'
  | 'ionicon'
  ;

/** A cross-platform icon object. */
export type Icon = {
  name: string,
  class: IconClass,
};

/** An icon object with separate icon definitions for Android and iOS. */
export type PlatformIcon =
  | {
      ios: Icon,
      android: Icon,
    }
  | Icon
  ;

//-----------------------------------------------------------------------------
//  Languages
//-----------------------------------------------------------------------------

/** Shorthand for languages available in the application. English or French. */
export type Language =
    'en'
  | 'fr'
  ;

//-----------------------------------------------------------------------------
//  Platforms
//-----------------------------------------------------------------------------

/** Platform types. Android or iOS. */
export type PlatformString =
    | 'ios'
    | 'android';

//-----------------------------------------------------------------------------
//  Semesters
//-----------------------------------------------------------------------------

/** A semester at the school, with its name, identifier, and other info. */
export type Semester = {
  code: string,
  current?: boolean,
} & (Name | TranslatedName);

//-----------------------------------------------------------------------------
//  Tabs
//-----------------------------------------------------------------------------

/** Describes the tabs available in the app's initial state. */
export type WelcomeTab =
    'splash'
  | 'update'
  | 'main'
  ;

/** Describes the tabs available in the app. */
export type Tab =
    'find'
  | 'schedule'
  | 'discover'
  | 'search'
  | 'settings'
  ;

/** The set of tabs in the app. */
export type TabSet = {
  discover: any,
  find: any,
  schedule: any,
  search: any,
  settings: any,
};

/** A navigator route. */
export type Route = {
  id: number | string, // Unique ID for the route
  data: any,           // Any data to pass along to be used to render the view
};

//-----------------------------------------------------------------------------
//  Buildings
//-----------------------------------------------------------------------------

/** A destination for navigation on campus. */
export type NavigationDestination = {
  code: string,
  room: ?string,
};

/** A room on campus, with a name and the facilities it offers represented by an ID. */
export type BuildingRoom = {
  name: string,
  type: number,
};

/** A predefined type of room and how it should be represented visually. */
export type RoomType = {
  icon: PlatformIcon,
} & (Name | TranslatedName);

/** A building on campus, with details describing it, its location, and its rooms. */
export type Building = {
  code: string,
  default_room_type: number,
  facilities: Array < Facility >,
  image: ReactClass < any >,
  lat: number,
  long: number,
  rooms: Array < BuildingRoom >,
} & (Name | TranslatedName);

/** Types of facilities that a certain building on campus may offer. */
export type Facility =
  | 'atm'
  | 'food'
  | 'printer'
  | 'store'
  | 'bed'
  | 'alcohol'
  | 'laundry'
  | 'library'
  | 'parking'
  | 'mail'
  | 'pharmacy'
  | 'gym'
  | 'pool'
  ;

//-----------------------------------------------------------------------------
//  Configuration
//-----------------------------------------------------------------------------

/** Describes configuration state. */
export type ConfigurationOptions = {
  alwaysSearchAll?: boolean,       // Always search the entire app, never within a view
  currentSemester?: number,        // Current semester for editing, selected by the user
  firstTime?: boolean,             // Indicates if it's the user's first time in the app
  language?: ?Language,            // User's preferred language
  preferredTimeFormat?: string,    // Either 12 or 24h time
  prefersWheelchair?: boolean,     // Only provide wheelchair accessible routes
  semesters?: Array < Semester >,  // List of semesters currently available
};

/** Describes a configuration file. */
export type ConfigFile = {
  name: string,     // Name of the file
  type: string,     // Type of file: image, json, csv, etc.
  version: number,  // Version number
};

export type Update = {
  currentDownload?: ?string,           // Name of file being downloaded
  filesDownloaded?: Array < string >,  // Array of filenames downloaded
  intermediateProgress?: number,       // Updated progress of current download
  showRetry?: boolean,                 // True to show retry button, false to hide
  showUpdateProgress?: boolean,        // True to show progress bar, false to hide
  totalFiles?: number,                 // Total number of files to download
  totalProgress?: number,              // Total bytes downloaded
  totalSize?: number,                  // Total number of bytes across all files
}

//-----------------------------------------------------------------------------
//  Actions
//-----------------------------------------------------------------------------

/** Available actions for modifying the application state. */
export type Action =
    { type: 'SEARCH_ALL', searchTerms: ?string }
  | { type: 'CLEAR_SEARCH' }
  | { type: 'SWITCH_TAB', tab: Tab; }
  | { type: 'CHANGE_LANGUAGE', language: Language }
  | { type: 'UPDATE_CONFIGURATION', options: ConfigurationOptions }
  | { type: 'UPDATE_PROGRESS', update: Update }
  | { type: 'SET_HEADER_TITLE', title: Name | TranslatedName }
  | { type: 'HEADER_SHOW_BACK', shouldShowBack: boolean }
  | { type: 'HEADER_SHOW_SEARCH', shouldShowSearch: boolean }
  | { type: 'FIND_VIEW', view: number }
  | { type: 'NAVIGATE_TO', destination: NavigationDestination }
  | { type: 'VIEW_BUILDING', building: Building }
  ;

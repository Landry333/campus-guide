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
 * Types.js
 *
 * @description
 * Variable type definitions for use throughout the app.
 *
 * @author
 * Joseph Roque
 *
 * @external
 * @flow
 *
 */
'use strict';

/******************************************************************************
 *    Icons
 *****************************************************************************/

export type DefaultIcon = {
  name: string,
  class: string,
};

export type PlatformIcon = {
  ios: DefaultIcon,
  android: DefaultIcon,
};

export type IconObject =
    | DefaultIcon
    | PlatformIcon;

/******************************************************************************
 *    Tabs
 *****************************************************************************/

export type TabIcons = {
  find: string,
  schedule: string,
  discover: string,
  settings: string,
};

/******************************************************************************
 *    Semesters
 *****************************************************************************/

type SemesterWithDefaultName = {
  code: string,
  current: boolean,
  name: string,
};

type SemesterWithTranslatedName = {
  code: string,
  current: boolean,
  name_en: string,
  name_fr: string,
};

export type Semester =
    | SemesterWithDefaultName
    | SemesterWithTranslatedName;

/******************************************************************************
 *    University
 *****************************************************************************/

type UniversityWithDefaultName = {
  lat: number,
  long: number,
  name: string,
};

type UniversityWithTranslatedNames = {
  lat: number,
  long: number,
  name_en: string,
  name_fr: string,
};

export type University =
    | UniversityWithDefaultName
    | UniversityWithTranslatedNames;

/******************************************************************************
 *    Buses
 *****************************************************************************/

type BusInfoWithDefault = {
  name: string,
  link: string,
};

type BusInfoWithTranslated = {
  name_en: string,
  name_fr: string,
  link_en: string,
  link_fr: string,
};

export type BusInfo =
    | BusInfoWithDefault
    | BusInfoWithTranslated;

type BusCampusWithDefaultName = {
  name: string,
  image: ReactClass,
};

type BusCampusWithTranslatedName = {
  name_en: string,
  name_fr: string,
  image: ReactClass,
};

export type BusCampus =
    | BusCampusWithDefaultName
    | BusCampusWithTranslatedName;

export type DetailedRouteInfo = {
  number: number,
  sign: string,
  days: Object,
};

export type TransitStop = {
  code: string,
  id: string,
  lat: number,
  long: number,
  name: string,
  routes: Array<number | DetailedRouteInfo>,
};

type TransitCampusWithDefaultName = {
  id: string,
  lat: number,
  long: number,
  name: string,
  stops: Array<TransitStop>,
};

type TransitCampusWithTranslatedName = {
  id: string,
  lat: number,
  long: number,
  name_en: string,
  name_fr: string,
  stops: Array<TransitStop>,
};

export type TransitCampus =
    | TransitCampusWithDefaultName
    | TransitCampusWithTranslatedName;

/******************************************************************************
 *    Shuttle
 *****************************************************************************/

export type ScheduleTimes = {
  days: string,
  times: Array<string>,
};

type ShuttleScheduleWithDefaultNameDefaultDirection = {
  name: string,
  direction: string,
  start_date: string,
  end_date: string,
  excluded_dates: Array<string>,
  times: Array<ScheduleTimes>,
};

type ShuttleScheduleWithTranslatedNameDefaultDirection = {
  name_en: string,
  name_fr: string,
  direction: string,
  start_date: string,
  end_date: string,
  excluded_dates: Array<string>,
  times: Array<ScheduleTimes>,
};

type ShuttleScheduleWithDefaultNameTranslatedDirection = {
  name: string,
  direction_en: string,
  direction_fr: string,
  start_date: string,
  end_date: string,
  excluded_dates: Array<string>,
  times: Array<ScheduleTimes>,
};

type ShuttleScheduleWithTranslatedNameTranslatedDirection = {
  name_en: string,
  name_fr: string,
  direction_en: string,
  direction_fr: string,
  start_date: string,
  end_date: string,
  excluded_dates: Array<string>,
  times: Array<ScheduleTimes>,
};

export type ShuttleSchedule =
    | ShuttleScheduleWithDefaultNameDefaultDirection
    | ShuttleScheduleWithDefaultNameTranslatedDirection
    | ShuttleScheduleWithTranslatedNameDefaultDirection
    | ShuttleScheduleWithTranslatedNameTranslatedDirection;

type ShuttleCampusWithDefaultName = {
  accurate: boolean,
  id: string,
  name: string,
  lat: number,
  long: number,
  schedules: Array<ShuttleSchedule>,
};

type ShuttleCampusWithTranslatedName = {
  accurate: boolean,
  id: string,
  name_en: string,
  name_fr: string,
  lat: number,
  long: number,
  schedules: Array<ShuttleSchedule>,
};

export type ShuttleCampus =
    | ShuttleCampusWithDefaultName
    | ShuttleCampusWithTranslatedName;

type ShuttleDetailsWithDefaultNameDefaultDetails = {
  details: Array<string>,
  name: string,
  icon: IconObject,
  image: ReactClass,
};

type ShuttleDetailsWithTranslatedNameDefaultDetails = {
  details: Array<string>,
  name_en: string,
  name_fr: string,
  icon: IconObject,
  image: ReactClass,
};

type ShuttleDetailsWithDefaultNameTranslatedDetails = {
  details_en: Array<string>,
  details_fr: Array<string>,
  name: string,
  icon: IconObject,
  image: ReactClass,
};

type ShuttleDetailsWithTranslatedNameTranslatedDetails = {
  details_en: Array<string>,
  details_fr: Array<string>,
  name_en: string,
  name_fr: string,
  icon: IconObject,
  image: ReactClass,
};

export type ShuttleDetails =
    | ShuttleDetailsWithDefaultNameDefaultDetails
    | ShuttleDetailsWithTranslatedNameDefaultDetails
    | ShuttleDetailsWithDefaultNameTranslatedDetails
    | ShuttleDetailsWithTranslatedNameTranslatedDetails;

/******************************************************************************
 *    Platforms
 *****************************************************************************/

export type PlatformString =
    | 'ios'
    | 'android';

/******************************************************************************
 *    Languages
 *****************************************************************************/

export type LanguageString =
    | 'en'
    | 'fr';

/******************************************************************************
 *    Location
 *****************************************************************************/

export type LatLong = {
 latitude: number,
 longitude: number,
 latitudeDelta: number,
 longitudeDelta: number,
};

/******************************************************************************
 *    Links
 *****************************************************************************/

type LinkWithDefaultNameDefaultLink = {
  name: string,
  link: string,
};

type LinkWithDefaultNameTranslatedLink = {
  name: string,
  link_en: string,
  link_fr: string,
};

type LinkWithTranslatedNameDefaultLink = {
  link: string,
  name_en: string,
  name_fr: string,
};

type LinkWithTranslatedNameTranslatedLink = {
  link_en: string,
  link_fr: string,
  name_en: string,
  name_fr: string,
};

export type Link =
    | LinkWithDefaultNameDefaultLink
    | LinkWithDefaultNameTranslatedLink
    | LinkWithTranslatedNameDefaultLink
    | LinkWithTranslatedNameTranslatedLink;

type LinkCategoryWithDefaultName = {
  name: string,
  image?: ReactClass,
  links?: Array<Link>,
  social?: Array<Link>,
  categories?: Array<LinkCategoryType>,
};

type LinkCategoryWithTranslatedName = {
  name_en: string,
  name_fr: string,
  image?: ReactClass,
  links?: Array<Link>,
  social?: Array<Link>,
  categories?: Array<LinkCategoryType>,
};

export type LinkCategoryType =
    | LinkCategoryWithDefaultName
    | LinkCategoryWithTranslatedName;

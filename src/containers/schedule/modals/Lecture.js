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
 * @created 2017-01-31
 * @file Lecture.js
 * @description Menu to add or edit a lecture.
 *
 * @flow
 */
'use strict';

// React imports
import React from 'react';
import {
  DatePickerIOS,
  Navigator,
  Picker,
  Platform,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';

// Redux imports
import { connect } from 'react-redux';

// Types
import type {
  Building,
  Course,
  Destination,
  Language,
  Lecture,
  LectureFormat,
  TimeFormat,
  VoidFunction,
} from 'types';

// Type definition for component props.
type Props = {
  addingLecture: boolean,                     // True when adding a new course, false when editing
  course: Course,                             // The course the lecture will be added to
  language: Language,                         // The current language, selected by the user
  lectureFormats: Array < LectureFormat >,    // Array of available lecture types
  lectureToEdit: ?Lecture,                    // Instance of a lecture to pre-populate in the modal
  timeFormat: TimeFormat,                     // The user's preferred time format
  onClose: VoidFunction,                      // Callback for when the modal is closed
  onSaveLecture: (lecture: Lecture) => void,  // Callback to save a lecture
};

// Type definition for component state.
type State = {
  day: number,                  // Day of the week the lecture takes place. 0 for monday.
  format: number,               // Format type of the lecture
  starts: number,               // Start time of the lecture, in minutes from midnight
  ends: number,                 // End time of the lecture, in minutes from midnight\
  location: ?Destination,       // Location where the class will take place
  rightActionEnabled: boolean,  // Indicates if the right modal action should be enabled
};

// Imports
import BuildingGrid from 'BuildingGrid';
import Header from 'Header';
import ModalHeader from 'ModalHeader';
import moment from 'moment';
import * as Constants from 'Constants';
import * as TextUtils from 'TextUtils';
import * as Translations from 'Translations';

// Navigation values
const MENU = 0;
const REGULAR_PICKER = 1;
const TIME_PICKER = 2;
const BUILDING_PICKER = 3;
const ROOM_PICKER = 4;

// Values to select by picker
const PICKER_FORMAT = 0;
const PICKER_DAY = 1;
const PICKER_STARTS = 2;
const PICKER_ENDS = 3;
const PICKER_BUILDING = 4;
const PICKER_ROOM = 5;

// Default day of a new lecture
const DEFAULT_DAY = 0;          // Monday
// Default format of a new lecture
const DEFAULT_FORMAT = 0;       // LEC
// Default start time of a new lecture
const DEFAULT_START_TIME = 780; // 1:00 pm
// Default end time of a new lecture
const DEFAULT_END_TIME = 870;   // 2:30 pm
// Default location of a new lecture
const DEFAULT_LOCATION = null;  // null

// Number of columns to display buildings in
const BUILDING_COLUMNS = 3;

class LectureModal extends React.Component {

  /**
   * Properties this component expects to be provided by its parent.
   */
  props: Props;

  /**
   * Current state of the component.
   */
  state: State;

  /**
   * Constructor.
   *
   * @param {props} props component props
   */
  constructor(props: Props) {
    super(props);

    const day = props.lectureToEdit ? props.lectureToEdit.day : DEFAULT_DAY;
    const starts = props.lectureToEdit ? props.lectureToEdit.startTime : DEFAULT_START_TIME;
    this.state = {
      format: props.lectureToEdit ? props.lectureToEdit.format : DEFAULT_FORMAT,
      ends: props.lectureToEdit ? props.lectureToEdit.endTime : DEFAULT_END_TIME,
      location: props.lectureToEdit ? props.lectureToEdit.location : DEFAULT_LOCATION,
      day,
      starts,
      rightActionEnabled: this._isLectureStartUnique(props.course, day, starts),
    };

    this._buildingList = require('../../../../assets/js/Buildings');
    (this:any)._isLectureStartUnique = this._isLectureStartUnique.bind(this);
    (this:any)._renderMenu = this._renderMenu.bind(this);
    (this:any)._renderRegularPicker = this._renderRegularPicker.bind(this);
    (this:any)._renderTimePicker = this._renderTimePicker.bind(this);
  }

  /** List of buildings in the app. */
  _buildingList: Array < Object > = [];

  /**
   * Closes this menu and, if editing, re-saves the provided lecture.
   */
  _close(): void {
    if (!this.props.addingLecture && this.props.lectureToEdit != null) {
      this._saveLecture(this.props.lectureToEdit);
    } else {
      this.props.onClose();
    }
  }

  /**
   * Defines the transition between views.
   *
   * @returns {Object} a configuration for scene transitions in the navigator.
   */
  _configureScene(): Object {
    return {
      ...Navigator.SceneConfigs.PushFromRight,
      gestures: false,
    };
  }

  /**
   * Converts a time in 24h format to a number of minutes since midnight.
   *
   * @param {string} formattedTime the time to convert
   * @returns {number} the minutes since midnight
   */
  _getMinutesFromMidnight(formattedTime: string): number {
    const MINUTES_POSITION = 3;

    const hours = parseInt(formattedTime.substr(0, 2));
    const minutes = parseInt(formattedTime.substr(MINUTES_POSITION));
    return hours * Constants.Time.MINUTES_IN_HOUR + minutes;
  }

  /**
   * Saves the lecture being edited or created.
   *
   * @param {Lecture} lecture the lecture to save
   */
  _saveLecture(lecture: Lecture): void {
    if (!this._isLectureStartUnique(this.props.course, lecture.day, lecture.startTime)) {
      return;
    }

    this.props.onSaveLecture(lecture);
    this.props.onClose();
  }

  /**
   * Checks if the start time of a lecture is unique.
   *
   * @param {Course} course    the course to check
   * @param {number} day       the day the lecture takes place
   * @param {number} startTime the start time of the lecture in minutes since midnight
   * @returns {boolean} true if the lecture start time is unique on the day, false otherwise
   */
  _isLectureStartUnique(course: Course, day: number, startTime: number): boolean {
    const lecturesLength = course.lectures.length;
    for (let i = 0; i < lecturesLength; i++) {
      if (course.lectures[i].day === day
          && course.lectures[i].startTime === startTime) {
        return false;
      }
    }

    return true;
  }

  /**
   * Sets the day the lecture will occur.
   *
   * @param {number} day day of the week. 0 is monday
   */
  _setDay(day: number): void {
    const rightActionEnabled = this._isLectureStartUnique(this.props.course, day, this.state.starts);
    this.setState({ day, rightActionEnabled });
  }

  /**
   * Sets the start or end time for the lecture
   *
   * @param {Date}    time        the time to set
   * @param {boolean} isStartTime true to set the start time, false to set ends time
   */
  _setTime(time: Date, isStartTime: boolean): void {
    if (isStartTime) {
      const updatedStartTime = this._getMinutesFromMidnight(moment(time).format('HH:mm'));
      const updatedEndTime = updatedStartTime + (this.state.ends - this.state.starts);
      const rightActionEnabled = this._isLectureStartUnique(this.props.course, this.state.day, updatedStartTime);

      this.setState({
        starts: updatedStartTime,
        ends: updatedEndTime,
        rightActionEnabled,
      });
    } else {
      const updatedEndTime = this._getMinutesFromMidnight(moment(time).format('HH:mm'));
      if (updatedEndTime > this.state.starts) {
        this.setState({ ends: updatedEndTime });
      }
    }
  }

  /**
   * Shows the picker to pick a value.
   *
   * @param {number} picking the value to pick
   */
  _showPicker(picking: number): void {
    if (picking === PICKER_STARTS || picking === PICKER_ENDS) {
      if (Platform.OS === 'android') {
        // FIXME: setup android picker
        throw new Error('No android picker setup');
      } else {
        this.refs.Navigator.push({ id: TIME_PICKER, picking });
      }
    } else if (picking === PICKER_BUILDING) {
      this.refs.Navigator.push({ id: BUILDING_PICKER });
    } else if (picking === PICKER_ROOM) {
      this.refs.Navigator.push({ id: ROOM_PICKER });
    } else {
      this.refs.Navigator.push({ id: REGULAR_PICKER, picking });
    }
  }

  /**
   * Handles when a building is selected.
   *
   * @param {?Building} building the building selected
   */
  _onBuildingSelect(building: ?Building): void {
    if (building == null) {
      this.setState({ location: null });
      this.refs.Navigator.pop();
    } else {
      this.setState({ location: { code: building.code, room: null }});
      this._showPicker(PICKER_ROOM);
    }
  }

  /**
   * Renders a view to select a building on campus.
   *
   * @returns {ReactElement<any>} a building grid to select a building
   */
  _renderBuildingPicker(): ReactElement < any > {
    const platformModifier: string = Platform.OS === 'ios' ? 'ios' : 'md';
    const backArrowIcon: string = `${platformModifier}-arrow-back`;

    const locationTranslation = Translations.get(this.props.language, 'location');
    const buildingTranslation = Translations.get(this.props.language, 'building');

    return (
      <View style={_styles.container}>
        <TouchableOpacity onPress={() => this.refs.Navigator.pop()}>
          <Header
              icon={{ name: backArrowIcon, class: 'ionicon' }}
              title={`${locationTranslation} - ${buildingTranslation}`} />
        </TouchableOpacity>
        <BuildingGrid
            buildingList={this._buildingList}
            columns={BUILDING_COLUMNS}
            disableImages={true}
            filter={''}
            includeClear={true}
            language={this.props.language}
            onSelect={this._onBuildingSelect.bind(this)} />
      </View>
    );
  }

  /**
   * Renders a view to select a room in the building.
   *
   * @returns {ReactElement<any>} a room grid to select a room
   */
  _renderRoomPicker(): ReactElement < any > {
    const platformModifier: string = Platform.OS === 'ios' ? 'ios' : 'md';
    const backArrowIcon: string = `${platformModifier}-arrow-back`;

    const locationTranslation = Translations.get(this.props.language, 'location');
    const roomTranslation = Translations.get(this.props.language, 'room');

    return (
      <View style={_styles.container}>
        <TouchableOpacity onPress={() => this.refs.Navigator.pop()}>
          <Header
              icon={{ name: backArrowIcon, class: 'ionicon' }}
              title={`${locationTranslation} - ${roomTranslation}`} />
        </TouchableOpacity>
      </View>
    );
  }

  /**
   * Renders a menu to display the values selected so far, and touchable elements to change these values.
   *
   * @returns {ReactElement<any>} a set of headers depicting the item and value
   */
  _renderMenu(): ReactElement < any > {
    const pickIcon = {
      class: 'material',
      name: 'chevron-right',
    };

    const format = this.props.lectureFormats[this.state.format].code;
    const day = Constants.Days[this.props.language][this.state.day];
    const startTime = TextUtils.getFormattedTimeSinceMidnight(this.state.starts, this.props.timeFormat);
    const endTime = TextUtils.getFormattedTimeSinceMidnight(this.state.ends, this.props.timeFormat);
    const location = this.state.location ? TextUtils.destinationToString(this.state.location) : '';

    return (
      <ScrollView>
        <TouchableOpacity onPress={this._showPicker.bind(this, PICKER_FORMAT)}>
          <Header
              largeSubtitle={true}
              subtitle={format}
              subtitleIcon={pickIcon}
              title={Translations.get(this.props.language, 'format')} />
        </TouchableOpacity>
        <View style={_styles.menuItemSeparator} />
        <TouchableOpacity onPress={this._showPicker.bind(this, PICKER_DAY)}>
          <Header
              largeSubtitle={true}
              subtitle={day}
              subtitleIcon={pickIcon}
              title={Translations.get(this.props.language, 'day')} />
        </TouchableOpacity>
        <View style={_styles.menuItemSeparator} />
        <TouchableOpacity onPress={this._showPicker.bind(this, PICKER_STARTS)}>
          <Header
              largeSubtitle={true}
              subtitle={startTime}
              subtitleIcon={pickIcon}
              title={Translations.get(this.props.language, 'starts')} />
        </TouchableOpacity>
        <View style={_styles.menuItemSeparator} />
        <TouchableOpacity onPress={this._showPicker.bind(this, PICKER_ENDS)}>
          <Header
              largeSubtitle={true}
              subtitle={endTime}
              subtitleIcon={pickIcon}
              title={Translations.get(this.props.language, 'ends')} />
        </TouchableOpacity>
        <View style={_styles.menuItemSeparator} />
        <TouchableOpacity onPress={this._showPicker.bind(this, PICKER_BUILDING)}>
          <Header
              largeSubtitle={true}
              subtitle={location}
              subtitleIcon={pickIcon}
              title={Translations.get(this.props.language, 'location')} />
        </TouchableOpacity>
      </ScrollView>
    );
  }

  /**
   * Renders a picker with a set of values for the user to choose from.
   *
   * @param {number} picking      the value being picked
   * @returns {ReactElement<any>} the picker with the options to select between
   */
  _renderRegularPicker(picking: number): ReactElement < any > {
    const platformModifier: string = Platform.OS === 'ios' ? 'ios' : 'md';
    const backArrowIcon: string = `${platformModifier}-arrow-back`;

    let title: string = '';
    let options: Array < any > = [];
    let selectedValue: any = 0;
    let getName = () => '';
    let setValue = () => this.setState({});
    switch (picking) {
      case PICKER_FORMAT:
        title = 'format';
        options = this.props.lectureFormats;
        selectedValue = this.state.format;
        getName = (format) => {
          const name = Translations.getName(this.props.language, this.props.lectureFormats[format]) || '';
          return `(${this.props.lectureFormats[format].code}) ${name}`;
        };
        setValue = (value) => this.setState({ format: value });
        break;
      case PICKER_DAY:
        title = 'day';
        options = Constants.Days[this.props.language];
        selectedValue = this.state.day;
        getName = (day) => Constants.Days[this.props.language][day];
        setValue = (value) => this._setDay(value);
        break;
      default:
        // do nothing
        // TODO: return some error view
    }

    return (
      <View style={_styles.container}>
        <TouchableOpacity onPress={() => this.refs.Navigator.pop()}>
          <Header
              icon={{ name: backArrowIcon, class: 'ionicon' }}
              title={Translations.get(this.props.language, title)} />
        </TouchableOpacity>
        <Picker
            itemStyle={_styles.pickerItem}
            prompt={Translations.get(this.props.language, title)}
            selectedValue={selectedValue}
            style={_styles.pickerContainer}
            onValueChange={setValue}>
          {options.map((option, index) => {
            return (
              <Picker.Item
                  key={getName(index)}
                  label={getName(index)}
                  value={index} />
            );
          })}
        </Picker>
      </View>
    );
  }

  /**
   * Renders a picker with a set of times for the user to choose from.
   *
   * @param {number} picking      the value being picked
   * @returns {ReactElement<any>} the time picker with the options to select between
   */
  _renderTimePicker(picking: number): ReactElement < any > {
    let title: string = '';
    let time = '13:00';
    let setValue = () => this.setState({});
    switch (picking) {
      case PICKER_STARTS:
        title = 'starts';
        time = moment(TextUtils.getFormattedTimeSinceMidnight(this.state.starts, '24h'), 'HH:mm').toDate();
        setValue = (value) => this._setTime(value, true);
        break;
      case PICKER_ENDS:
        title = 'ends';
        time = moment(TextUtils.getFormattedTimeSinceMidnight(this.state.ends, '24h'), 'HH:mm').toDate();
        setValue = (value) => this._setTime(value, false);
        break;
      default:
        // do nothing
        // TODO: return some error view
    }

    return (
      <View style={_styles.container}>
        <TouchableOpacity onPress={() => this.refs.Navigator.pop()}>
          <Header
              icon={{ name: 'ios-arrow-back', class: 'ionicon' }}
              title={Translations.get(this.props.language, title)} />
        </TouchableOpacity>
        <DatePickerIOS
            date={time}
            minuteInterval={5}
            mode={'time'}
            style={_styles.pickerContainer}
            onDateChange={setValue} />
      </View>
    );
  }

  /**
   * Renders the current scene based on the navigation route.
   *
   * @param {Object} route the route to render
   * @returns {ReactElement<any>} the rendering of the scene
   */
  _renderScene(route: {id: number, picking?: number}): ReactElement < any > {
    switch (route.id) {
      case MENU:
        return this._renderMenu();
      case REGULAR_PICKER:
        return this._renderRegularPicker(route.picking || PICKER_FORMAT);
      case TIME_PICKER:
        return this._renderTimePicker(route.picking || PICKER_STARTS);
      case BUILDING_PICKER:
        return this._renderBuildingPicker();
      case ROOM_PICKER:
        return this._renderRoomPicker();
      default:
        // TODO: return some error view
        return (
          <View />
        );
    }
  }

  /**
   * Renders the app tabs and icons, an indicator to show the current tab, and a navigator with the tab contents.
   *
   * @returns {ReactElement<any>} the hierarchy of views to render.
   */
  render(): ReactElement < any > {
    let modalTitle = 'add_lecture';
    let modalRightAction = 'add';
    if (!this.props.addingLecture) {
      modalTitle = 'edit_lecture';
      modalRightAction = 'save';
    }

    return (
      <View style={_styles.container}>
        <ModalHeader
            leftActionEnabled={true}
            leftActionText={Translations.get(this.props.language, 'cancel')}
            rightActionEnabled={this.state.rightActionEnabled}
            rightActionText={Translations.get(this.props.language, modalRightAction)}
            title={Translations.get(this.props.language, modalTitle)}
            onLeftAction={this._close.bind(this)}
            onRightAction={() => this._saveLecture({
              day: this.state.day,
              format: this.state.format,
              startTime: this.state.starts,
              endTime: this.state.ends,
              location: this.state.location,
            })} />
        <Navigator
            configureScene={this._configureScene}
            initialRoute={{ id: MENU }}
            ref='Navigator'
            renderScene={this._renderScene.bind(this)}
            style={_styles.container} />
      </View>
    );
  }
}

// Private styles for component
const _styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Constants.Colors.secondaryBackground,
  },
  pickerContainer: {
    flex: 1,
    backgroundColor: Constants.Colors.tertiaryBackground,
  },
  pickerItem: {
    color: Constants.Colors.primaryBlackText,
    fontSize: Constants.Sizes.Text.Subtitle,
  },
  menuItemSeparator: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: Constants.Colors.secondaryWhiteText,
  },
});

const mapStateToProps = (store) => {
  return {
    language: store.config.options.language,
    timeFormat: store.config.options.preferredTimeFormat,
  };
};

export default connect(mapStateToProps)(LectureModal);

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
 * @created 2017-01-27
 * @file Schedule.js
 * @description Navigator for managing views for defining a weekly schedule.
 *
 * @flow
 */
'use strict';

// React imports
import React from 'react';
import {
  LayoutAnimation,
  Modal,
  Picker,
  Platform,
  StyleSheet,
  View,
} from 'react-native';

// Redux imports
import { connect } from 'react-redux';
import * as actions from 'actions';

// Types
import type {
  ConfigurationOptions,
  Course,
  Language,
  LectureFormat,
  Semester,
  TimeFormat,
} from 'types';

// Type definition for component props.
type Props = {
  currentSemester: number,                                // The current semester, selected by the user
  language: Language,                                     // The current language, selected by the user
  saveCourse: (s: string, course: Course) => void,        // Saves a course to the semester
  semesters: Array < Semester >,                          // Semesters available at the university
  timeFormat: TimeFormat,                                 // The user's preferred time format
  updateConfiguration: (o: ConfigurationOptions) => void, // Update the global configuration state
};

// Type definition for component state.
type State = {
  addingCourse: boolean,                    // True to use the course modal to add a course, false to edit
  courseToEdit: ?Course,                    // Course selected by user to edit
  courseModalVisible: boolean,              // True to show the modal to add or edit a course
  lectureFormats: Array < LectureFormat >,  // Array of available lecture types
  showSemesters: boolean,                   // True to show drop down to swap semesters
};

// Imports
import ActionButton from 'react-native-action-button';
import CourseModal from './modals/Course';
import Header from 'Header';
import ScrollableTabView from 'react-native-scrollable-tab-view';
import * as Configuration from 'Configuration';
import * as Constants from 'Constants';
import * as DisplayUtils from 'DisplayUtils';
import * as TranslationUtils from 'TranslationUtils';

// Tabs
import Weekly from './WeeklyView';
import ByCourse from './ByCourseView';

// Icon for representing the current semester
const semesterIcon = {
  android: {
    class: 'ionicons',
    name: 'md-calendar',
  },
  ios: {
    class: 'ionicons',
    name: 'ios-calendar-outline',
  },
};

class Schedule extends React.Component {

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
    this.state = {
      addingCourse: true,
      courseToEdit: null,
      courseModalVisible: false,
      lectureFormats: [],
      showSemesters: false,
    };

    (this:any)._closeModal = this._closeModal.bind(this);
    (this:any)._toggleSwitchSemester = this._toggleSwitchSemester.bind(this);
  }

  componentDidMount(): void {
    if (this.state.lectureFormats.length === 0) {
      Configuration.init()
          .then(() => Configuration.getConfig('/lecture_formats.json'))
          .then((lectureFormats) => this.setState({ lectureFormats }))
          .catch((err: any) => console.error('Configuration could not be initialized for lecture modal.', err));
    }
  }

  /**
   * Closes the course modal.
   */
  _closeModal(): void {
    this.setState({ courseModalVisible: false });
  }

  /**
   * Opens the course modal to add or edit a course.
   *
   * @param {boolean} addingCourse true to use the modal to add a course, false to edit
   * @param {?Course} courseToEdit the course to edit, or null when adding a new course
   */
  _showCourseModal(addingCourse: boolean, courseToEdit: ?Course): void {
    this.setState({
      courseModalVisible: true,
      addingCourse,
      courseToEdit,
    });
  }

  /**
   * Toggles the drop down to switch semesters.
   */
  _toggleSwitchSemester(): void {
    LayoutAnimation.easeInEaseOut();
    this.setState({ showSemesters: !this.state.showSemesters });
  }

  /**
   * Saves a course to the provided semester.
   *
   * @param {number} semester the semester to add the course to
   * @param {Course} course   the course being saved
   */
  _onSaveCourse(semester: string, course: Course): void {
    console.log(`TODO: save course: ${semester} - ${JSON.stringify(course)}`);
  }

  /**
   * Renders the current semester and a drop down to switch semesters.
   *
   * @param {Object} Translations translations in the current language of certain text
   * @returns {ReactElement<any>} the elements to render
   */
  _renderSemesters(Translations: Object): ReactElement < any > {
    const semesterName = TranslationUtils.getTranslatedName(
      this.props.language,
      this.props.semesters[this.props.currentSemester]
    ) || '';

    return (
      <View>
        <Header
            icon={DisplayUtils.getPlatformIcon(Platform.OS, semesterIcon)}
            subtitle={(this.state.showSemesters ? Translations.cancel : Translations.switch)}
            subtitleCallback={this._toggleSwitchSemester}
            title={semesterName} />
        {this.state.showSemesters
          ?
            <Picker
                itemStyle={_styles.semesterItem}
                prompt={Translations.semester}
                selectedValue={this.props.currentSemester}
                onValueChange={(value) => this.props.updateConfiguration({ currentSemester: value })}>
              {this.props.semesters.map((semester, index) => {
                const name = TranslationUtils.getTranslatedName(this.props.language, semester);
                return (
                  <Picker.Item
                      key={name}
                      label={name}
                      value={index} />
                );
              })}
            </Picker>
          : null}
      </View>
    );
  }

  /**
   * Renders the app tabs and icons, an indicator to show the current tab, and a navigator with the tab contents.
   *
   * @returns {ReactElement<any>} the hierarchy of views to render.
   */
  render(): ReactElement < any > {
    // Get current language for translations
    const Translations: Object = TranslationUtils.getTranslations(this.props.language);

    return (
      <View style={_styles.container}>
        <Modal
            animationType={'slide'}
            transparent={false}
            visible={this.state.courseModalVisible}
            onRequestClose={this._closeModal}>
          <CourseModal
              addingCourse={this.state.addingCourse}
              courseToEdit={this.state.courseToEdit}
              lectureFormats={this.state.lectureFormats}
              onClose={this._closeModal}
              onSaveCourse={this._onSaveCourse.bind(this)} />
        </Modal>
        <ScrollableTabView
            style={{ borderBottomWidth: 0 }}
            tabBarActiveTextColor={Constants.Colors.primaryWhiteText}
            tabBarBackgroundColor={Constants.Colors.darkTransparentBackground}
            tabBarInactiveTextColor={Constants.Colors.secondaryWhiteText}
            tabBarPosition='top'
            tabBarUnderlineStyle={{ backgroundColor: Constants.Colors.primaryWhiteText }}>
          <Weekly tabLabel={Translations.weekly}>
            {this._renderSemesters(Translations)}
          </Weekly>
          <ByCourse tabLabel={Translations.by_course}>
            {this._renderSemesters(Translations)}
          </ByCourse>
        </ScrollableTabView>
        <ActionButton
            buttonColor={Constants.Colors.primaryBackground}
            offsetX={Constants.Sizes.Margins.Expanded}
            offsetY={Constants.Sizes.Margins.Regular}
            onPress={this._showCourseModal.bind(this, true)} />
      </View>
    );
  }
}

// Private styles for component
const _styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Constants.Colors.primaryBackground,
  },
  semesterItem: {
    color: Constants.Colors.primaryWhiteText,
  },
});

const mapStateToProps = (store) => {
  return {
    currentSemester: store.config.options.currentSemester,
    language: store.config.options.language,
    semesters: store.config.options.semesters,
    timeFormat: store.config.options.preferredTimeFormat,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    saveCourse: (semester: string, course: Course) => dispatch(actions.addCourse(semester, course)),
    updateConfiguration: (options: ConfigurationOptions) => dispatch(actions.updateConfiguration(options)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Schedule);

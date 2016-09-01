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
 * @file Upcoming.js
 * @providesModule Upcoming
 * @description View to display the user's upcoming classes and events for the day.
 *
 * @flow
 */
'use strict';

// React imports
import React from 'react';
import {
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

// Type imports
import type {
  DefaultFunction,
} from 'types';

// Type definition for component props.
type Props = {
  onEdit: DefaultFunction,
};

// Type definition for component state.
type State = {
  loaded: boolean,
};

// Imports
const Constants = require('Constants');
const Preferences = require('Preferences');
const TranslationUtils = require('TranslationUtils');

class Upcoming extends React.Component {

  /**
   * Properties which the parent component should make available to this component.
   */
  static propTypes = {
    onEdit: React.PropTypes.func.isRequired,
  };

  /**
   * Define type for the component state.
   */
  state: State;

  /**
   * Pass props and declares initial state.
   *
   * @param {Props} props properties passed from container to this component.
   */
  constructor(props: Props) {
    super(props);
    this.state = {
      loaded: false,
    };
  }

  /**
   * Renders a list of the user's upcoming classes, or a view which links to the Schedule tab so the user can update
   * their schedule.
   *
   * @returns {ReactElement<any>} the hierarchy of views to render.
   */
  render(): ReactElement < any > {
    // Get current language for translations
    const Translations: Object = TranslationUtils.getTranslations(Preferences.getSelectedLanguage());

    if (this.state.loaded) {
      return (
        <View />
      );
    } else {
      return (
        <TouchableOpacity
            style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}
            onPress={this.props.onEdit}>
          <Text style={{color: 'white', textAlign: 'center', fontSize: Constants.Text.Medium}}>
            {Translations.no_courses_added}
          </Text>
        </TouchableOpacity>
      );
    }
  }
}

module.exports = Upcoming;

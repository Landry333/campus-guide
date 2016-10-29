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
 * @created 2016-10-14
 * @file AppHeader.js
 * @providesModule AppHeader
 * @description Navigation and search bar for the top of the app, to allow the user to
 *              search from anywhere
 *
 * @flow
 */
'use strict';

// React imports
import React from 'react';
import {
  // LayoutAnimation,
  Platform,
  StyleSheet,
  TouchableOpacity,
  Text,
  // TextInput,
  View,
} from 'react-native';

// Redux imports
import {connect} from 'react-redux';

// Imports
const Constants = require('Constants');
const Ionicons = require('react-native-vector-icons/Ionicons');

// Height of the navbar
const NAVBAR_HEIGHT: number = 60;
const HEADER_PADDING_IOS: number = 25;

class AppHeader extends React.Component {

  _startSearch(): void {
    console.log('Search app');
  }

  _onBack(): void {
    console.log('Navigate back');
  }

  /**
   * Renders a title, back button for navigation, and search button.
   *
   * @returns {ReactElement<any>} the hierarchy of views to render
   */
  render(): ReactElement < any > {
    const platformModifier: string = Platform.OS === 'ios' ? 'ios' : 'md';
    const backArrowIcon: string = platformModifier + '-arrow-back';
    const searchIcon: string = platformModifier + '-search';

    return (
      <View style={_styles.container}>
        <TouchableOpacity
            style={[_styles.iconWrapper/* , backIconStyle */]}
            onPress={this._onBack.bind(this)}>
          <Ionicons
              color={Constants.Colors.primaryWhiteIcon}
              name={backArrowIcon}
              size={Constants.Sizes.Icons.Medium}
              style={_styles.icon} />
        </TouchableOpacity>
        <View style={_styles.titleContainer}>
          <Text style={_styles.title}>{this.props.appTitle}</Text>
        </View>
        <TouchableOpacity
            style={[_styles.iconWrapper/* , searchIconStyle*/]}
            onPress={this._startSearch.bind(this)}>
          <Ionicons
              color={Constants.Colors.primaryWhiteIcon}
              name={searchIcon}
              size={Constants.Sizes.Icons.Medium}
              style={_styles.icon} />
        </TouchableOpacity>
      </View>
    );
  }
}

// Private styles for component
const _styles = StyleSheet.create({
  container: {
    backgroundColor: Constants.Colors.primaryBackground,
    flexDirection: 'row',
    alignItems: 'center',
    height: NAVBAR_HEIGHT,
    marginTop: Platform.OS === 'ios' ? HEADER_PADDING_IOS : 0,
  },
  icon: {

  },
  iconWrapper: {

  },
  title: {
    textAlign: 'center',
  },
  titleContainer: {
    flex: 1,
    alignItems: 'center',
  },
});

// Map state to props
const select = (store) => {
  return {
    appTitle: 'Campus Guide', // store.config.appTitle,
  };
};

// Map dispatch to props
const actions = (dispatch) => {
  return {};
};

module.exports = connect(select, actions)(AppHeader);

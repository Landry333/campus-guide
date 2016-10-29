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
 * @file NavBar.js
 * @description Navigation and search bar for the top of the app, to allow the user to
 *              search from anywhere.
 *
 * @flow
 */
'use strict';

// React imports
import React from 'react';
import {
  LayoutAnimation,
  Platform,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  View,
} from 'react-native';

// Type imports
import type {
  DefaultFunction,
} from 'types';

// Type definition for component props.
type Props = {
  onBack: ?DefaultFunction,         // Invoked when the user presses the back button
  onSearch: (text: ?string) => any, // Invoked when the user performs a search
};

// Type definition for component state.
type State = {
  refresh?: boolean,        // Toggle to force a render
  showBackButton?: boolean, // True to show the back button, false to hide
  searching?: boolean,      // True if the user has recently performed a search, false otherwise
  searchPlaceholder?: ?string,
};

// Imports
const Constants = require('Constants');
const Ionicons = require('react-native-vector-icons/Ionicons');
const Preferences = require('Preferences');
const SearchManager = require('SearchManager');
const StatusBarUtils = require('StatusBarUtils');
const TranslationUtils = require('TranslationUtils');

// Height of the navbar
const NAVBAR_HEIGHT: number = 60;

class NavBar extends React.Component {

  /**
   * Properties which the parent component should make available to this component.
   */
  static propTypes = {
    onBack: React.PropTypes.func,
    onSearch: React.PropTypes.func.isRequired,
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
      refresh: false,
      showBackButton: false,
      searching: false,
      searchPlaceholder: null,
    };

    // Explicitly binding 'this' to certain methods
    (this:any).getRefresh = this.getRefresh.bind(this);
  }

  /**
   * Configures the app to animate the next layout change, then updates the state.
   *
   * @param {State} state the new state for the component.
   */
  setState(state: State): void {
    if (state.showBackButton == null && state.searching == null) {
      super.setState(state);
    } else {
      requestAnimationFrame(() => {
        LayoutAnimation.easeInEaseOut();
        super.setState(state);
      });
    }
  }

  _searchText: ?string;

  /**
   * Returns the current state of the refresh variable, to allow it to be flipped to re-render the view.
   *
   * @returns {boolean} the value of {this.state.refresh}.
   */
  getRefresh(): boolean {
    if (this.state.refresh == null) {
      return false;
    }

    return this.state.refresh;
  }

  /**
   * Clears the search field.
   */
  clearSearch(): void {
    this.refs.SearchInput.clear();
    this.refs.SearchInput.blur();
    this._onSearch(null);
  }

  /**
   * Removes all search listeners.
   */
  _searchAll(): void {
    SearchManager.pauseAllSearchListeners();
    this._onSearch(this._searchText);
  }

  /**
   * Clears the search field and requests a back navigation.
   */
  _onBack(): void {
    this.clearSearch();
    if (this.props.onBack) {
      this.props.onBack();
    }
  }

  /**
   * Prompts the app to search.
   *
   * @param {?string} text params to search for.
   */
  _onSearch(text: ?string): void {
    this._searchText = text;
    this.props.onSearch(text);
    if (text != null && text.length > 0) {
      if (!this.state.searching) {
        LayoutAnimation.easeInEaseOut();
        this.setState({
          searching: true,
        });
      }
    } else if (this.state.searching) {
      LayoutAnimation.easeInEaseOut();
      this.setState({
        searching: false,
      });
    }
  }

  /**
   * Renders a text input field for searching.
   *
   * @returns {ReactElement<any>} the hierarchy of views to render.
   */
  render(): ReactElement < any > {
    // Get current language for translations
    const Translations: Object = TranslationUtils.getTranslations(Preferences.getSelectedLanguage());

    // If there is a placeholder to display, show it. Otherwise, use default
    const searchPlaceholder = this.state.searchPlaceholder == null || Preferences.getAlwaysSearchAll()
        ? Translations.search_placeholder
        : this.state.searchPlaceholder;

    const searchMargin = Constants.Margins.Regular;
    let searchLeftMargin: number = searchMargin;
    let searchRightMargin: number = searchMargin;
    let backIconStyle: Object = {width: 0};
    let searchAllIconStyle: Object = {width: 0};

    if (this.state.showBackButton) {
      backIconStyle = {width: 50};
      searchLeftMargin = 0;
    }

    if (this.state.searching && SearchManager.totalNumberOfSearchListeners() > 0 && !Preferences.getAlwaysSearchAll()) {
      searchAllIconStyle = {width: 50};
      searchRightMargin = 0;
    }

    const platformModifier: string = Platform.OS === 'ios' ? 'ios' : 'md';
    const backArrowName: string = platformModifier + '-arrow-back';
    const searchName: string = platformModifier + '-search';
    const closeName: string = platformModifier + '-close';

    return (
      <View style={_styles.container}>
        <TouchableOpacity
            style={[_styles.iconWrapper, backIconStyle]}
            onPress={this._onBack.bind(this)}>
          <Ionicons
              color={'white'}
              name={backArrowName}
              size={Constants.Icons.Medium}
              style={_styles.navBarIcon} />
        </TouchableOpacity>
        <View style={[_styles.searchContainer, {marginLeft: searchLeftMargin, marginRight: searchRightMargin}]}>
          <Ionicons
              color={'white'}
              name={searchName}
              size={Constants.Icons.Medium}
              style={_styles.searchIcon}
              onPress={() => this.refs.SearchInput.focus()} />
          <TextInput
              autoCorrect={false}
              placeholder={searchPlaceholder}
              placeholderTextColor={Constants.Colors.lightGrey}
              ref='SearchInput'
              style={_styles.searchText}
              onChangeText={this._onSearch.bind(this)} />
          {(this.state.searching)
              ? <Ionicons
                  color={'white'}
                  name={closeName}
                  size={Constants.Icons.Large}
                  style={_styles.clearIcon}
                  onPress={this.clearSearch.bind(this)} /> : null}
        </View>
        <TouchableOpacity
            style={[_styles.iconWrapper, searchAllIconStyle]}
            onPress={this._searchAll.bind(this)}>
          <Ionicons
              color={'white'}
              name={'md-globe'}
              size={Constants.Icons.Medium}
              style={_styles.navBarIcon} />
        </TouchableOpacity>
      </View>
    );
  }
}

// Private styles for component
const _styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    height: NAVBAR_HEIGHT,
    marginTop: StatusBarUtils.getStatusBarPadding(Platform),
  },
  searchContainer: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'row',
    borderRadius: Constants.Margins.Regular,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    margin: Constants.Margins.Regular,
  },
  searchIcon: {
    marginLeft: Constants.Margins.Regular,
    marginRight: Constants.Margins.Regular,
  },
  clearIcon: {
    width: 30,
  },
  searchText: {
    flex: 1,
    height: 40,
    color: Constants.Colors.polarGrey,
  },
  navBarIcon: {
    marginTop: Constants.Margins.Regular,
  },
  iconWrapper: {
    height: 40,
    alignItems: 'center',
  },
});

module.exports = NavBar;

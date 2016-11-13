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
  Dimensions,
  LayoutAnimation,
  Platform,
  StyleSheet,
  TouchableOpacity,
  Text,
  TextInput,
  View,
} from 'react-native';

// Redux imports
import {connect} from 'react-redux';
import {
  clearSearch,
  navigateBack,
  search,
} from 'actions';

// Types
import type {
  Language,
  Name,
  TranslatedName,
  Tab,
} from 'types';

// Type definition for component props.
type Props = {
  appTitle: Name | TranslatedName,  // Title for the header
  language: Language,               // The user's currently selected language
  onBack: () => void,               // Tells the app to navigate one screen backwards
  onSearch: (st: ?string) => void,  // Updates the user's search terms
  shouldShowBack: boolean,          // Indicates if the header should show a back button
  shouldShowSearch: boolean,        // Indicates if the header should show a search input option
  tab: Tab,                         // The current tab the user has open
}

// Type definition for component state.
type State = {
  shouldShowBack: boolean,          // Indicates if the header should show a back button
  shouldShowSearch: boolean,        // Indicates if the header should show a search button
  shouldShowSearchBar: boolean,     // Indicates if the header should hide the title and show a search input
}

// Imports
import Ionicons from 'react-native-vector-icons/Ionicons';
import * as Constants from 'Constants';
import * as TranslationUtils from 'TranslationUtils';

// Height of the navbar
const NAVBAR_HEIGHT: number = 50;
const HEADER_PADDING_IOS: number = 25;
const ICON_SIZE: number = 50;

// Width of the search input
const {width} = Dimensions.get('window');
const SEARCH_INPUT_WIDTH = width - ICON_SIZE * 2;

class AppHeader extends React.Component {

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
      shouldShowBack: false,
      shouldShowSearch: false,
      shouldShowSearchBar: false,
    };
  }

  /**
   * Updates which icons are showing with an animation.
   *
   * @param {Props} nextProps the new props
   */
  componentWillReceiveProps(nextProps: Props): void {
    if (nextProps.shouldShowBack != this.props.shouldShowBack
        || nextProps.shouldShowSearch != this.props.shouldShowSearch) {
      if (!(nextProps.shouldShowSearch && this.state.shouldShowSearchBar)) {
        this.refs.SearchInput.blur();
      }

      LayoutAnimation.easeInEaseOut();
      this.setState({
        shouldShowBack: nextProps.shouldShowBack,
        shouldShowSearch: nextProps.shouldShowSearch,
        shouldShowSearchBar: nextProps.shouldShowSearch && this.state.shouldShowSearchBar,
      });
    }
  }

  /**
   * Shows/hides the search input.
   */
  _toggleSearch(): void {
    if (this.state.shouldShowSearchBar) {
      this.refs.SearchInput.blur();
    } else {
      this.refs.SearchInput.focus();
    }

    LayoutAnimation.easeInEaseOut();
    this.setState({
      shouldShowSearchBar: !this.state.shouldShowSearchBar,
    });
  }

  /**
   * Navigates back in the application.
   */
  _onBack(): void {
    this.refs.SearchInput.clear();
    this.refs.SearchInput.blur();
    this.props.onBack();
  }

  /**
   * Prompts the app to search.
   *
   * @param {?string} text params to search for.
   */
  _onSearch(text: ?string): void {
    this.props.onSearch(text);
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

    // Get current language for translations
    const Translations: Object = TranslationUtils.getTranslations(this.props.language);

    // If title is string, use it as key for translations
    let appTitle: string;
    if (typeof (this.props.appTitle) === 'string') {
      appTitle = Translations[this.props.appTitle];
    } else {
      appTitle = TranslationUtils.getTranslatedName(this.props.language, this.props.appTitle) || '';
    }

    // Hide/show back button
    let backIconStyle: Object = {left: -ICON_SIZE};
    if (this.props.shouldShowBack) {
      backIconStyle = {left: 0};
    }

    // Hide/show search button, title
    let searchIconStyle: Object = {right: -ICON_SIZE};
    if (this.props.shouldShowSearch) {
      searchIconStyle = {right: 0};
    }

    // Hide/show title and search input
    let titleStyle: Object = {};
    let searchInputStyle: Object = {right: -SEARCH_INPUT_WIDTH};
    if (this.state.shouldShowSearchBar) {
      titleStyle = {opacity: 0};
      searchInputStyle = {right: ICON_SIZE};
    }

    return (
      <View style={_styles.container}>
        <View style={[_styles.titleContainer, titleStyle]}>
          <Text style={_styles.title}>{appTitle}</Text>
        </View>
        <View style={[_styles.searchContainer, searchInputStyle]}>
          <Ionicons
              color={'white'}
              name={searchIcon}
              size={Constants.Sizes.Icons.Medium}
              style={_styles.searchIcon}
              onPress={() => this.refs.SearchInput.focus()} />
          <TextInput
              autoCorrect={false}
              placeholder={Translations.search_placeholder}
              placeholderTextColor={Constants.Colors.lightGrey}
              ref='SearchInput'
              style={_styles.searchText}
              onChangeText={this._onSearch.bind(this)} />
        </View>
        <TouchableOpacity
            style={[_styles.icon, searchIconStyle]}
            onPress={this._toggleSearch.bind(this)}>
          <Ionicons
              color={Constants.Colors.primaryWhiteIcon}
              name={searchIcon}
              size={Constants.Sizes.Icons.Medium}
              style={_styles.noBackground} />
        </TouchableOpacity>
        <TouchableOpacity
            style={[_styles.icon, backIconStyle]}
            onPress={this._onBack.bind(this)}>
          <Ionicons
              color={Constants.Colors.primaryWhiteIcon}
              name={backArrowIcon}
              size={Constants.Sizes.Icons.Medium}
              style={_styles.noBackground} />
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
  searchContainer: {
    flex: 1,
    width: SEARCH_INPUT_WIDTH,
    alignItems: 'center',
    flexDirection: 'row',
    borderRadius: Constants.Sizes.Margins.Regular,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    margin: Constants.Sizes.Margins.Regular,
    position: 'absolute',
  },
  searchIcon: {
    marginLeft: Constants.Sizes.Margins.Regular,
    marginRight: Constants.Sizes.Margins.Regular,
  },
  searchText: {
    flex: 1,
    height: 35,
    color: Constants.Colors.polarGrey,
  },
  icon: {
    position: 'absolute',
    width: ICON_SIZE,
    height: ICON_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    textAlign: 'center',
    fontSize: Constants.Sizes.Text.Title,
    color: Constants.Colors.primaryWhiteText,
  },
  titleContainer: {
    flex: 1,
    alignItems: 'center',
  },
  noBackground: {
    backgroundColor: 'rgba(0,0,0,0)',
  },
});

// Map state to props
const select = (store) => {
  return {
    appTitle: store.header.title,
    language: store.config.language,
    shouldShowBack: store.header.shouldShowBack,
    shouldShowSearch: store.header.shouldShowSearch,
    tab: store.navigation.tab,
  };
};

// Map dispatch to props
const actions = (dispatch) => {
  return {
    onBack: () => {
      dispatch(navigateBack());
      dispatch(clearSearch());
    },
    onSearch: (text: ?string) => dispatch(search(text)),
  };
};

export default connect(select, actions)(AppHeader);

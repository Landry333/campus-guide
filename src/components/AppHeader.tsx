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
 * @created 2016-10-14
 * @file AppHeader.tsx
 * @description Navigation and search bar for the top of the app, to allow the user to
 *              search from anywhere
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
import { connect } from 'react-redux';
import * as actions from '../actions';

// Imports
import Ionicons from 'react-native-vector-icons/Ionicons';
import * as Constants from '../constants';
import * as Translations from '../util/Translations';

// Types
import { Language } from '../util/Translations';
import { Name, Tab } from '../../typings/global';

interface Props {
  appTitle: Name;                           // Title for the header
  filter: string | undefined;               // The current search terms
  language: Language;                       // The user's currently selected language
  shouldShowBack: boolean;                  // Indicates if the header should show a back button
  shouldShowSearch: boolean;                // Indicates if the header should show a search input option
  tab: Tab;                                 // The current tab the user has open
  onBack(): void;                           // Tells the app to navigate one screen backwards
  onSearch(st?: string | undefined): void;  // Updates the user's search terms
}

interface State {
  shouldShowBack: boolean;          // Indicates if the header should show a back button
  shouldShowSearch: boolean;        // Indicates if the header should show a search button
  shouldShowSearchBar: boolean;     // Indicates if the header should hide the title and show a search input
}

// Height of the navbar
const NAVBAR_HEIGHT = 45;
const ICON_SIZE = 45;

// Width of the search input
const screenWidth = Dimensions.get('window').width;
const SEARCH_INPUT_WIDTH = screenWidth - ICON_SIZE * 2 - Constants.Sizes.Margins.Regular * 2;

class AppHeader extends React.PureComponent<Props, State> {

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
    if (nextProps.shouldShowBack !== this.props.shouldShowBack
        || nextProps.shouldShowSearch !== this.props.shouldShowSearch
        || nextProps.tab !== this.props.tab) {
      if (!(nextProps.shouldShowSearch && this.state.shouldShowSearchBar)) {
        (this.refs.SearchInput as any).blur();
      }

      if (nextProps.tab !== this.props.tab && nextProps.tab === 'search') {
        (this.refs.SearchInput as any).focus();
      }

      LayoutAnimation.easeInEaseOut(undefined, undefined);
      this.setState({
        shouldShowBack: nextProps.shouldShowBack,
        shouldShowSearch: nextProps.shouldShowSearch || nextProps.tab === 'search',
        shouldShowSearchBar: (nextProps.shouldShowSearch && this.state.shouldShowSearchBar)
            || nextProps.tab === 'search',
      });
    }
  }

  /**
   * Shows/hides the search input.
   */
  _toggleSearch(): void {
    if (this.state.shouldShowSearchBar) {
      (this.refs.SearchInput as any).blur();
      this.props.onSearch();
    } else {
      (this.refs.SearchInput as any).focus();
    }

    LayoutAnimation.easeInEaseOut(undefined, undefined);
    this.setState({
      shouldShowSearchBar: !this.state.shouldShowSearchBar,
    });
  }

  /**
   * Navigates back in the application.
   */
  _onBack(): void {
    (this.refs.SearchInput as any).clear();
    (this.refs.SearchInput as any).blur();
    this.props.onBack();
  }

  /**
   * Prompts the app to search.
   *
   * @param {string|undefined} text params to search for
   */
  _onSearch(text?: string | undefined): void {
    if (text === this.props.filter) {
      return;
    }
    this.props.onSearch(text);
  }

  /**
   * Renders a title, back button for navigation, and search button.
   *
   * @returns {JSX.Element} the hierarchy of views to render
   */
  render(): JSX.Element {
    const platformModifier = Platform.OS === 'ios' ? 'ios' : 'md';
    const backArrowIcon = `${platformModifier}-arrow-back`;
    const searchIcon = `${platformModifier}-search`;
    const closeIcon = `${platformModifier}-close`;

    // If title is string, use it as key for translations
    const appTitle = (typeof (this.props.appTitle) === 'string')
        ? Translations.get(this.props.language, this.props.appTitle)
        : Translations.getName(this.props.language, this.props.appTitle) || '';

    // Hide/show back button
    let backIconStyle = { left: -ICON_SIZE };
    if (this.props.shouldShowBack) {
      backIconStyle = { left: 0 };
    }

    // Hide/show search button, title
    let searchIconStyle = { right: -ICON_SIZE };
    if (this.props.shouldShowSearch) {
      searchIconStyle = { right: 0 };
    }

    // Hide/show title and search input
    let titleStyle = {};
    let searchInputStyle = { right: -(SEARCH_INPUT_WIDTH + Constants.Sizes.Margins.Regular * 2) };
    if (this.state.shouldShowSearchBar) {
      titleStyle = { opacity: 0 };
      searchInputStyle = { right: ICON_SIZE };
    }

    return (
      <View style={_styles.container}>
        <View style={[ _styles.titleContainer, titleStyle ]}>
          <Text
              ellipsizeMode={'tail'}
              numberOfLines={1}
              style={_styles.title}>
            {appTitle}
          </Text>
        </View>
        <View style={[ _styles.searchContainer, searchInputStyle ]}>
          <Ionicons
              color={Constants.Colors.primaryWhiteIcon}
              name={searchIcon}
              size={Constants.Sizes.Icons.Medium}
              style={_styles.searchIcon}
              onPress={(): void => (this.refs.SearchInput as any).focus()} />
          <TextInput
              autoCorrect={false}
              placeholder={Translations.get(this.props.language, 'search_placeholder')}
              placeholderTextColor={Constants.Colors.secondaryWhiteText}
              ref='SearchInput'
              returnKeyType={'done'}
              style={_styles.searchText}
              value={this.props.filter}
              onChangeText={this._onSearch.bind(this)} />
        </View>
        <TouchableOpacity
            style={[ _styles.icon, searchIconStyle ]}
            onPress={this._toggleSearch.bind(this)}>
          <Ionicons
              color={Constants.Colors.primaryWhiteIcon}
              name={(this.state.shouldShowSearchBar) ? closeIcon : searchIcon}
              size={Constants.Sizes.Icons.Medium}
              style={_styles.noBackground} />
        </TouchableOpacity>
        <TouchableOpacity
            style={[ _styles.icon, backIconStyle ]}
            onPress={this._onBack.bind(this)}>
          <Ionicons
              color={Constants.Colors.primaryWhiteIcon}
              name={backArrowIcon}
              size={Constants.Sizes.Icons.Medium}
              style={_styles.noBackground} />
        </TouchableOpacity>
        <View style={_styles.separator} />
      </View>
    );
  }
}

// Private styles for component
const _styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: Constants.Colors.primaryBackground,
    flexDirection: 'row',
    height: NAVBAR_HEIGHT,
    marginTop: Constants.Sizes.HeaderPadding[Platform.OS],
  },
  icon: {
    alignItems: 'center',
    height: ICON_SIZE,
    justifyContent: 'center',
    position: 'absolute',
    width: ICON_SIZE,
  },
  noBackground: {
    backgroundColor: 'rgba(0,0,0,0)',
  },
  searchContainer: {
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    borderRadius: Constants.Sizes.Margins.Regular,
    flex: 1,
    flexDirection: 'row',
    margin: Constants.Sizes.Margins.Regular,
    position: 'absolute',
    width: SEARCH_INPUT_WIDTH,
  },
  searchIcon: {
    marginLeft: Constants.Sizes.Margins.Regular,
    marginRight: Constants.Sizes.Margins.Regular,
  },
  searchText: {
    color: Constants.Colors.primaryWhiteText,
    flex: 1,
    height: 35,
  },
  separator: {
    backgroundColor: Constants.Colors.tertiaryBackground,
    bottom: 0,
    height: StyleSheet.hairlineWidth,
    position: 'absolute',
    width: screenWidth,
  },
  title: {
    color: Constants.Colors.primaryWhiteText,
    fontSize: Constants.Sizes.Text.Title,
    paddingLeft: ICON_SIZE,
    paddingRight: ICON_SIZE,
    textAlign: 'center',
  },
  titleContainer: {
    alignItems: 'center',
    flex: 1,
  },
});

const mapStateToProps = (store: any): any => {
  return {
    appTitle: store.header.title,
    filter: store.search.terms,
    language: store.config.options.language,
    shouldShowBack: store.header.showBack,
    shouldShowSearch: store.header.showSearch,
    tab: store.navigation.tab,
  };
};

const mapDispatchToProps = (dispatch: any): any => {
  return {
    onBack: (): void => {
      dispatch(actions.navigateBack());
      dispatch(actions.search());
    },
    onSearch: (text?: string | undefined): void => dispatch(actions.search(text)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(AppHeader) as any;

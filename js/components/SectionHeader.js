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
 * @file SectionHeader.js
 * @providesModule SectionHeader
 * @description Predefined style for section separating headers in the app.
 *
 * @flow
 */
'use strict';

// React imports
import React from 'react';
import {
  StyleSheet,
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
  backgroundOverride: ?string,          // Forced background color for the view
  sectionIcon: ?string,                 // Large icon for the section header
  sectionIconClass: ?string,            // Class of the icon (ionicon / material)
  sectionIconOnClick: ?DefaultFunction, // Callback for when the icon is pressed
  sectionName: string,                  // Title for the section
  subtitleIcon: ?string,                // Small icon for the subtitle
  subtitleIconClass: ?string,           // Class of the icon (ionicon / material)
  subtitleName: ?string,                // Text for the subtitle
  subtitleOnClick: ?DefaultFunction,    // Callback for when the subtitle is pressed
  useBlackText: ?boolean,               // True to use black text, false to use white
};

// Type definition for component state.
type State = {
  sectionIcon: string,        // The current icon for the section header
  sectionIconClass: string,   // The current class of the icon
  subtitleIcon: string,       // The current subtitle icon
  subtitleIconClass: string,  // The current class of the icon
  subtitleName: string,       // The current text for the subtitle
  textAndIconColor: string,   // The color for the text and icons
};

// Imports
const Constants = require('Constants');
const Ionicons = require('react-native-vector-icons/Ionicons');
const MaterialIcons = require('react-native-vector-icons/MaterialIcons');

// Represents a value in the subtitle which should not be used.
const NULL_SUBTITLE_VALUE: string = 'value_null';
// List of icon families that the subtitle icon can belong to.
const VALID_ICON_CLASSES: Array<?string> = ['material', 'ionicon'];

class SectionHeader extends React.Component {

  /**
   * Properties which the parent component should make available to this component.
   */
  static propTypes = {
    backgroundOverride: React.PropTypes.string,
    sectionIcon: React.PropTypes.string,
    sectionIconClass: React.PropTypes.oneOf(VALID_ICON_CLASSES),
    sectionIconOnClick: React.PropTypes.func,
    sectionName: React.PropTypes.string.isRequired,
    subtitleIcon: React.PropTypes.string,
    subtitleIconClass: React.PropTypes.oneOf(VALID_ICON_CLASSES),
    subtitleName: React.PropTypes.string,
    subtitleOnClick: React.PropTypes.func,
    useBlackText: React.PropTypes.bool,
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

    const sectIcon = this.props.sectionIcon || NULL_SUBTITLE_VALUE;
    const sectIconClass = this.props.sectionIconClass || NULL_SUBTITLE_VALUE;
    const subName = this.props.subtitleName || NULL_SUBTITLE_VALUE;
    const subIcon = this.props.subtitleIcon || NULL_SUBTITLE_VALUE;
    const subIconClass = this.props.subtitleIconClass || NULL_SUBTITLE_VALUE;
    const textAndIconColor = this.props.useBlackText
        ? Constants.Colors.primaryBlackText
        : Constants.Colors.primaryWhiteText;

    this.state = {
      sectionIcon: sectIcon,
      sectionIconClass: sectIconClass,
      subtitleName: subName,
      subtitleIcon: subIcon,
      subtitleIconClass: subIconClass,
      textAndIconColor: textAndIconColor,
    };
  }

  /**
   * Update state depending on new props
   *
   * @param {Props} nextProps the new props being passed
   */
  componentWillReceiveProps(nextProps: Object): void {
    if (nextProps.sectionIcon !== this.props.sectionIcon
        || nextProps.sectionIconClass !== this.props.sectionIconClass
        || nextProps.subtitleName !== this.props.subtitleName
        || nextProps.subtitleIcon !== this.props.subtitleIcon
        || nextProps.subtitleIconClass !== this.props.subtitleIconClass
        || nextProps.useBlackText !== this.props.useBlackText) {
      const sectIcon = nextProps.sectionIcon || this.props.sectionIcon;
      const sectIconClass = nextProps.sectionIconClass || this.props.sectionIconClass;
      const subName = nextProps.subtitleName || this.props.subtitleName;
      const subIcon = nextProps.subtitleIcon || this.props.subtitleIcon;
      const subIconClass = nextProps.subtitleIconClass || this.props.subtitleIconClass;
      const textAndIconColor =
          (nextProps.useBlackText || (nextProps.useBlackText == null && this.props.useBlackText))
          ? Constants.Colors.primaryBlackText
          : Constants.Colors.primaryWhiteText;

      this.state = {
        sectionIcon: sectIcon,
        sectionIconClass: sectIconClass,
        subtitleName: subName,
        subtitleIcon: subIcon,
        subtitleIconClass: subIconClass,
        textAndIconColor: textAndIconColor,
      };
    }
  }

  /**
   * Creates a view containing this SectionHeader's icon, so long as it is not null.
   *
   * @returns {?ReactElement<any>} a view with the SectionHeader's icon, or null
   */
  _renderIcon(): ?ReactElement < any > {
    let icon: ?ReactElement < any > = null;

    if (this.state.sectionIcon !== NULL_SUBTITLE_VALUE && this.state.sectionIconClass !== NULL_SUBTITLE_VALUE) {
      if (this.state.sectionIconClass === 'material') {
        icon = (
          <MaterialIcons
              color={this.state.textAndIconColor}
              name={this.state.sectionIcon}
              size={Constants.Icon.Medium}
              style={_styles.sectionIcon} />
        );
      } else {
        icon = (
          <Ionicons
              color={this.state.textAndIconColor}
              name={this.state.sectionIcon}
              size={Constants.Icon.Medium}
              style={_styles.sectionIcon} />
        );
      }

      // Wrap the icon in a TouchableOpacity if there an onClick function
      if (this.props.sectionIconOnClick) {
        icon = (
          <TouchableOpacity onPress={this.props.sectionIconOnClick}>
            {icon}
          </TouchableOpacity>
        );
      }
    }

    return icon;
  }

  /**
   * Creates a view containing this SectionHeader's subtitle icon, so long as it is not null.
   *
   * @returns {?ReactElement<any>} a view with the SectionHeader's subtitle icon, or null
   */
  _renderSubtitleIcon(): ?ReactElement < any > {
    let subtitleIcon: ?ReactElement < any > = null;

    if (this.state.subtitleIcon && this.state.subtitleIcon !== NULL_SUBTITLE_VALUE
        && this.state.subtitleIconClass && this.state.subtitleIconClass !== NULL_SUBTITLE_VALUE) {
      if (this.state.subtitleIconClass === 'material') {
        subtitleIcon = (
          <MaterialIcons
              color={this.state.textAndIconColor}
              name={this.state.subtitleIcon}
              size={Constants.Icon.Small}
              style={_styles.subtitleIcon} />
        );
      } else {
        subtitleIcon = (
          <Ionicons
              color={this.state.textAndIconColor}
              name={this.state.subtitleIcon}
              size={Constants.Icon.Small}
              style={_styles.subtitleIcon} />
        );
      }
    }

    return subtitleIcon;
  }

  /**
   * Creates a text view containing this SectionHeader's subtitle name, so long as it is not null.
   *
   * @returns {?ReactElement<any>} a text view with the SectionHeader's subtitle name, or null
   */
  _renderSubtitleName(): ?ReactElement < any > {
    let subtitleName: ?ReactElement < any > = null;

    if (this.state.subtitleName && this.state.subtitleName !== NULL_SUBTITLE_VALUE) {
      subtitleName = (
        <Text style={[_styles.subtitleName, {color: this.state.textAndIconColor}]}>
          {this.state.subtitleName.toUpperCase()}
        </Text>
      );
    }

    return subtitleName;
  }

  /**
   * Builds a view containing the SectionHeader's subtitle name and icon, as long as one of them is defined.
   *
   * @returns {?ReactElement<any>} a view with the subtitle name and icon, or null if neither exists.
   */
  _renderSubtitleWithIcon(): ?ReactElement < any > {
    let iconAndSubtitle: ?ReactElement < any > = null;
    const subtitleName: ?ReactElement < any > = this._renderSubtitleName.call(this);
    const subtitleIcon: ?ReactElement < any > = this._renderSubtitleIcon.call(this);

    // If the SectionHeader has a subtitle name or icon, then create this element
    if (subtitleName !== null || subtitleIcon !== null) {
      if (this.props.subtitleOnClick) {
        // If there is an action that occurs when a subtitle is clicked, add a TouchableOpacity
        iconAndSubtitle = (
          <TouchableOpacity
              activeOpacity={0.4}
              style={_styles.iconAndSubtitle}
              onPress={this.props.subtitleOnClick}>
            {subtitleName}
            {subtitleIcon}
          </TouchableOpacity>
        );
      } else {
        // Otherwise, just draw the name and icon
        iconAndSubtitle = (
          <View style={_styles.iconAndSubtitle}>
            {subtitleName}
            {subtitleIcon}
          </View>
        );
      }
    }

    return iconAndSubtitle;
  }

  /**
   * Builds the components of the section header, including the title, icon, subtitle, and subtitle icon.
   *
   * @returns {ReactElement<any>} the hierarchy of views to render.
   */
  render(): ReactElement < any > {
    // Set the background color of the header to a default value if not provided
    const headerBackground = this.props.backgroundOverride || Constants.Colors.defaultComponentBackgroundColor;

    return (
      <View style={[_styles.header, {backgroundColor: headerBackground}]}>
        {this._renderIcon.call(this)}
        <Text
            ellipsizeMode={'tail'}
            numberOfLines={1}
            style={[_styles.sectionName, {color: this.state.textAndIconColor}]}>
          {this.props.sectionName}
        </Text>
        {this._renderSubtitleWithIcon.call(this)}
      </View>
    );
  }
}

// Private styles for component
const _styles = StyleSheet.create({
  header: {
    height: 50,
    alignItems: 'center',
    flexDirection: 'row',
  },
  sectionIcon: {
    marginLeft: Constants.Margin.Expanded,
    marginTop: Constants.Margin.Regular,
    marginBottom: Constants.Margin.Regular,
  },
  sectionName: {
    marginLeft: Constants.Margin.Expanded,
    fontSize: Constants.Text.Large,
  },
  iconAndSubtitle: {
    position: 'absolute',
    right: 0,
    flex: 1,
    flexDirection: 'row',
  },
  subtitleName: {
    margin: Constants.Margin.Expanded,
    fontSize: Constants.Text.Small,
  },
  subtitleIcon: {
    marginTop: Constants.Margin.Expanded,
    marginBottom: Constants.Margin.Expanded,
    marginRight: Constants.Margin.Expanded,
  },
});

module.exports = SectionHeader;

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
 * @created 2016-10-29
 * @file Menu.tsx
 * @description Provides a set of categories for a user to select between
 */
'use strict';

// React imports
import React from 'react';
import {
  Dimensions,
  FlatList,
  Image,
  Platform,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';

// Types
import { Language } from '../util/Translations';
import { MenuSection } from '../../typings/global';

interface Props {
  language: Language;                       // The user's currently selected language
  sections: MenuSection[];                  // List of sections to display
  sectionsOnScreen?: number;                // Max number of sections to display at a time. Default is 4.
  onSectionSelected(section: string): void; // Displays contents of the section in a new view
}

interface State {}

// Imports
import Header from './Header';
import * as Configuration from '../util/Configuration';
import * as Constants from '../constants';
import * as Display from '../util/Display';
import * as Translations from '../util/Translations';

/** Width of the screen. */
const screenDimensions = Dimensions.get('window');

/** Aspect ratio of cards. */
const CARD_ASPECT_RATIO = 0.75;

/** Default maximum number of cards on screen at a time. */
const DEFAULT_MAX_CARDS = 4;

/** Width of a standard card. */
const cardWidth = screenDimensions.width - (Constants.Sizes.Margins.Expanded * 2);

export default class Menu extends React.PureComponent<Props, State> {

  /**
   * Returns the height of a card, depending on the max number of cards on the screen
   * at a time.
   *
   * @returns {number} calculated height of a card
   */
  _getCardHeight(): number {
    const maxCardHeightRatio = this.props.sectionsOnScreen || DEFAULT_MAX_CARDS;

    return Math.min(cardWidth * CARD_ASPECT_RATIO, screenDimensions.height / maxCardHeightRatio);
  }

  /**
   * Returns the image to render for the section, if one exists.
   *
   * @param {MenuSection} section the section to render image for
   * @returns {JSX.Element|undefined} the image for the section
   */
  _getSectionImage(section: MenuSection): JSX.Element | undefined {
    let image: JSX.Element;
    const borderRadius = Platform.OS === 'android' ? { borderRadius: Constants.Sizes.Margins.Regular } : {};

    if (section.image) {
      if (typeof (section.image) === 'string') {
        image = (
          <Image
              resizeMode={'cover'}
              source={{ uri: Configuration.getImagePath(section.image) }}
              style={[ _styles.sectionImage, borderRadius ]} />
        );
      } else {
        image = (
          <Image
              resizeMode={'cover'}
              source={section.image}
              style={[ _styles.sectionImage, borderRadius ]} />
        );
      }
    }

    return image;
  }

  /**
   * Renders a view for a section.
   *
   * @param {MenuSection} item  the section to render
   * @param {number}      index index of the section
   * @returns {JSX.Element} a view with the section image and title
   */
  _renderSection({ item }: { item: MenuSection; index: number }): JSX.Element {
    const icon = Display.getPlatformIcon(Platform.OS, item);
    const cardDimensions = { height: this._getCardHeight(), width: screenDimensions.width };
    const sectionImage = this._getSectionImage(item);

    return (
      <TouchableOpacity
          style={[ _styles.cardIOS, cardDimensions ]}
          onPress={(): void => this.props.onSectionSelected(item.id)}>
        {sectionImage}
        <Header
            icon={icon}
            title={Translations.getName(item) || ''} />
        <View style={_styles.separator} />
      </TouchableOpacity>
    );
  }

  /**
   * Renders a card for a section.
   *
   * @param {MenuSection} item  the section to render
   * @param {number}      index index of the section
   * @returns {JSX.Element} a card with the section image and title
   */
  _renderSectionCard({ item, index }: { item: MenuSection; index: number }): JSX.Element {
    const icon = Display.getPlatformIcon(Platform.OS, item);
    const viewMargins: object = index === 0 ? {} : { marginTop: 0 };
    const cardHeight = { height: this._getCardHeight() };
    const sectionImage = this._getSectionImage(item);

    return (
      <TouchableOpacity
          style={[ _styles.cardShadow, _styles.rounded ]}
          onPress={(): void => this.props.onSectionSelected(item.id)}>
        <View style={[ _styles.cardAndroid, _styles.rounded, viewMargins, cardHeight ]}>
          {sectionImage}
          <Header
              icon={icon}
              style={[ _styles.rounded, { borderBottomLeftRadius: 0, borderBottomRightRadius: 0 } ]}
              title={Translations.getName(item) || ''} />
        </View>
      </TouchableOpacity>
    );
  }

  /**
   * Renders each of the sections, with one of them focused and showing an image.
   *
   * @returns {JSX.Element} the hierarchy of views to render
   */
  render(): JSX.Element {
    return (
      <FlatList
          data={this.props.sections}
          keyExtractor={(section: MenuSection): string => section.id}
          renderItem={Platform.OS === 'ios' ? this._renderSection.bind(this) : this._renderSectionCard.bind(this)}
          style={_styles.container} />
    );
  }
}

// Private styles for component
const _styles = StyleSheet.create({
  cardAndroid: {
    overflow: 'hidden',
    width: cardWidth,
  },
  cardIOS: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  cardShadow: {
    elevation: Constants.Sizes.Margins.Condensed,
    margin: Constants.Sizes.Margins.Expanded,
    shadowOffset: {
      height: Constants.Sizes.Margins.Condensed,
      width: 0,
    },
    shadowOpacity: 0.5,
    shadowRadius: Constants.Sizes.Margins.Regular,
  },
  container: {
    flex: 1,
  },
  rounded: {
    borderRadius: Constants.Sizes.Margins.Regular,
  },
  sectionImage: {
    bottom: 0,
    flex: 1,
    height: undefined,
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
    width: undefined,
  },
  separator: {
    backgroundColor: Constants.Colors.tertiaryBackground,
    bottom: 0,
    height: StyleSheet.hairlineWidth,
    left: 0,
    position: 'absolute',
    right: 0,
  },
});

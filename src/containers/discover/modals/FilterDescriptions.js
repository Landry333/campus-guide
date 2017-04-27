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
 * @created 2017-03-13
 * @file FilterDescriptions.js
 * @description List of places to study on campus, along with directions and filtering
 *
 * @flow
 */
'use strict';

// React imports
import React from 'react';
import {
  FlatList,
  Platform,
  StyleSheet,
  Text,
  View,
} from 'react-native';

// Types
import type { Language, StudySpotFilter } from 'types';

// Type definition for component props.
type Props = {
  filters: Array < StudySpotFilter >, // List of filters for filtering spots
  language: Language,                 // The current language, selected by the user
}

// Imports
import PaddedIcon from 'PaddedIcon';
import * as Constants from 'Constants';
import * as DisplayUtils from 'DisplayUtils';
import * as Translations from 'Translations';

export default class StudySpots extends React.Component {

  /**
   * Properties this component expects to be provided by its parent.
   */
  props: Props;

  /**
   * Renders a description of a filter.
   *
   * @param {StudySpotFilter} filter the filter to render
   * @returns {ReactElement<any>} the filter icon, name and description
   */
  _renderItem({ item }: { item: StudySpotFilter }): ReactElement < any > {
    const name = Translations.getName(this.props.language, item) || '';
    const description = Translations.getVariant(this.props.language, 'description', item) || '';
    const icon = DisplayUtils.getPlatformIcon(Platform.OS, item);

    return (
      <View style={_styles.filter}>
        {icon == null
          ? null
          : <PaddedIcon
              color={Constants.Colors.primaryWhiteText}
              icon={icon} /> }
        <View style={_styles.filterDescription}>
          <Text style={_styles.filterName}>{name}</Text>
          <Text style={_styles.filterType}>{description}</Text>
        </View>
      </View>
    );
  }

  /**
   * Renders a separator line between rows.
   *
   * @returns {ReactElement<any>} a separator for the list of filters
   */
  _renderSeparator(): ReactElement < any > {
    return <View style={_styles.separator} />;
  }

  /**
   * Renders a list of descriptions for the filters.
   *
   * @returns {ReactElement<any>} the hierarchy of views to render.
   */
  render(): ReactElement < any > {
    return (
      <View style={_styles.container}>
        <FlatList
            ItemSeparatorComponent={this._renderSeparator}
            data={this.props.filters}
            keyExtractor={(filter) => Translations.getEnglishName(filter) || ''}
            renderItem={this._renderItem.bind(this)} />
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
  filter: {
    marginTop: Constants.Sizes.Margins.Expanded,
    marginBottom: Constants.Sizes.Margins.Expanded,
    marginRight: Constants.Sizes.Margins.Expanded,
    alignItems: 'center',
    flexDirection: 'row',
  },
  filterDescription: {
    flex: 1,
  },
  filterName: {
    color: Constants.Colors.primaryWhiteText,
    fontSize: Constants.Sizes.Text.Title,
  },
  filterType: {
    color: Constants.Colors.primaryWhiteText,
    fontSize: Constants.Sizes.Text.Body,
    marginTop: Constants.Sizes.Margins.Regular,
  },
  separator: {
    height: StyleSheet.hairlineWidth,
    marginLeft: Constants.Sizes.Margins.Expanded,
    backgroundColor: Constants.Colors.tertiaryBackground,
  },
});

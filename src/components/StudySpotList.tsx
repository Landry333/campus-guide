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
 * @created 2017-03-09
 * @file StudySpotList.tsx
 * @description Displays a list of filterable study spots
 */
'use strict';

// React imports
import React from 'react';
import {
  FlatList,
  Image,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

// Imports
import moment from 'moment';
import PaddedIcon from './PaddedIcon';
import * as Configuration from '../util/Configuration';
import * as Constants from '../constants';
import * as Display from '../util/Display';
import * as TextUtils from '../util/TextUtils';
import * as Translations from '../util/Translations';
import { filterStudySpot } from '../util/Search';

// Types
import { Language } from '../util/Translations';
import { TimeFormat } from '../../typings/global';
import { StudySpot } from '../../typings/university';

interface Props {
  activeFilters: Set<string>;   // Set of active study spot filters
  filter: string | undefined;   // Filter the list of buildings
  studyFilters: any;            // Descriptions of study room filters
  language: Language;           // Language to display building names in
  spots: StudySpot[];           // Study spot properties to display
  timeFormat: TimeFormat;       // Format to display times in
  onSelect(s: StudySpot): void; // Callback for when a spot is selected
}

interface State {
  studySpots: StudySpot[];  // List of study spots
}

/** Regular expression for recognizing an unavailable time. */
const TIME_UNAVAILABLE_REGEX = /[Nn]\/[Aa]/;

export default class StudySpotList extends React.PureComponent<Props, State> {

  /**
   * Constructor.
   *
   * @param {props} props component props
   */
  constructor(props: Props) {
    super(props);
    this.state = { studySpots: [] };
  }

  /**
   * Loads the study spots once the view has been mounted.
   */
  componentDidMount(): void {
    this._filterStudySpots(this.props);
  }

  /**
   * If a new filter is provided, update the list of study spots.
   *
   * @param {Props} nextProps the new props being received
   */
  componentWillReceiveProps(nextProps: Props): void {
    // Basic boolean comparisons to see if re-filtering needs to occur
    if (nextProps.filter !== this.props.filter
        || nextProps.language !== this.props.language
        || nextProps.spots !== this.props.spots
        || this.props.activeFilters !== nextProps.activeFilters) {
      this._filterStudySpots(nextProps);
    }
  }

  /**
   * Check if the spot contains all of the active filters.
   *
   * @param {Set<string>} activeFilters currently active filters
   * @param {StudySpot}   spot          details about the study spot
   * @returns {boolean} true iff the spot contains all the active filters, false otherwise
   */
  _spotMatchesAllFilters(activeFilters: Set < string >, spot: StudySpot): boolean {
    if (activeFilters.size === 0) {
      return true;
    }

    let matches = 0;
    spot.filters.forEach((filter: string) => {
      if (activeFilters.has(filter)) {
        matches++;
      }
    });

    if (activeFilters.has('open')) {
      if (TIME_UNAVAILABLE_REGEX.test(spot.opens)) {
        matches++;
      } else {
        const openTime = moment(spot.opens, 'HH:mm');
        const closeTime = moment(spot.closes, 'HH:mm');
        const currentTime = moment();
        if (openTime.diff(currentTime) < 0 && closeTime.diff(currentTime, 'hours') >= 1) {
          matches++;
        }
      }
    }

    return matches === activeFilters.size;
  }

  /**
   * Only show study spots which names or building names contain the search terms.
   *
   * @param {Props} props the props to use to filter
   */
  _filterStudySpots({ activeFilters, filter, language, spots }: Props): void {
    // Ignore the case of the search terms
    const adjustedFilter = (filter == undefined || filter.length === 0) ? undefined : filter.toUpperCase();

    // Create array for spots
    const filteredSpots: StudySpot[] = [];

    spots.forEach((studySpot: StudySpot) => {
      if (!this._spotMatchesAllFilters(activeFilters, studySpot)) {
        return;
      }

      if (!adjustedFilter || filterStudySpot(language, adjustedFilter, studySpot).success) {
        filteredSpots.push(studySpot);
      }
    });

    this.setState({ studySpots: filteredSpots });
  }

  /**
   * Displays a spots's name, image and description.
   *
   * @param {StudySpot} spot information about the study spot to display
   * @returns {JSX.Element} an image and views describing the spot
   */
  _renderItem({ item }: { item: StudySpot }): JSX.Element {
    const altName = Translations.getName(this.props.language, item);
    const name = `${item.building} ${item.room ? item.room : ''}`;
    const description = Translations.getDescription(this.props.language, item) || '';

    const openingTime = TIME_UNAVAILABLE_REGEX.test(item.opens)
        ? item.opens
        : TextUtils.convertTimeFormat(this.props.timeFormat, item.opens);

    const closingTime = TIME_UNAVAILABLE_REGEX.test(item.closes)
        ? ` - ${item.closes}`
        : ` - ${TextUtils.convertTimeFormat(this.props.timeFormat, item.closes)}`;

    return (
      <TouchableOpacity
          key={name}
          onPress={(): void => this.props.onSelect(item)}>
        <View style={_styles.spot}>
          <Image
              resizeMode={'cover'}
              source={{ uri: Configuration.getImagePath(item.image) }}
              style={_styles.spotImage} />
          <View style={_styles.spotProperties}>
            <Text style={_styles.spotName}>{name}</Text>
            {altName == undefined ? undefined : <Text style={_styles.spotSubtitle}>{altName}</Text>}
            <Text style={_styles.spotSubtitle}>{`${openingTime}${closingTime}`}</Text>
            <Text style={_styles.spotDescription}>{description}</Text>
            <View style={_styles.spotFilters}>
              {item.filters.map((filter: string) => (
                <PaddedIcon
                    color={Constants.Colors.primaryWhiteIcon}
                    icon={Display.getPlatformIcon(Platform.OS, this.props.studyFilters[filter])}
                    key={filter}
                    size={Constants.Sizes.Icons.Medium}
                    width={Constants.Sizes.Icons.Medium + Constants.Sizes.Margins.Expanded} />
              ))}
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  /**
   * Renders a separator line between rows.
   *
   * @returns {JSX.Element} a separator for the list of study spots
   */
  _renderSeparator(): JSX.Element {
    return <View style={_styles.separator} />;
  }

  /**
   * Returns a list of touchable views listing the study spot descriptions.
   *
   * @returns {JSX.Element} the hierarchy of views to render
   */
  render(): JSX.Element {
    return (
      <View style={_styles.container}>
        <FlatList
            ItemSeparatorComponent={this._renderSeparator.bind(this)}
            data={this.state.studySpots}
            keyExtractor={(studySpot: StudySpot): string => `${studySpot.building}.${studySpot.room}`}
            renderItem={this._renderItem.bind(this)} />
      </View>
    );
  }
}

// Private styles for component
const _styles = StyleSheet.create({
  container: {
    backgroundColor: Constants.Colors.primaryBackground,
    flex: 1,
  },
  separator: {
    backgroundColor: Constants.Colors.tertiaryBackground,
    height: StyleSheet.hairlineWidth,
    marginLeft: Constants.Sizes.Margins.Expanded,
  },
  spot: {
    alignItems: 'center',
    flex: 1,
    flexDirection: 'row',
    margin: Constants.Sizes.Margins.Expanded,
  },
  spotDescription: {
    color: Constants.Colors.primaryWhiteText,
    fontSize: Constants.Sizes.Text.Body,
    marginTop: Constants.Sizes.Margins.Condensed,
  },
  spotFilters: {
    alignSelf: 'flex-end',
    flexDirection: 'row',
    marginTop: Constants.Sizes.Margins.Expanded,
  },
  spotImage: {
    alignSelf: 'flex-start',
    height: 64,
    marginRight: Constants.Sizes.Margins.Expanded,
    width: 64,
  },
  spotName: {
    color: Constants.Colors.primaryWhiteText,
    fontSize: Constants.Sizes.Text.Subtitle,
  },
  spotProperties: {
    flex: 1,
  },
  spotSubtitle: {
    color: Constants.Colors.secondaryWhiteText,
    fontSize: Constants.Sizes.Text.Caption,
    marginTop: Constants.Sizes.Margins.Condensed,
  },
});

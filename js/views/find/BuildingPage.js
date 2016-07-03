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
 * @file BuildingPage.js
 * @module BuildingPage
 * @description View for the root navigation for finding a room on campus.
 *
 * @flow
 */
'use strict';

// React imports
import React from 'react';
import {
  Alert,
  Dimensions,
  Image,
  ListView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

// Type imports
import type {
  Building,
  BuildingRoom,
  Facility,
} from '../../types';

import type {
  SearchListener,
} from '../../util/SearchManager';

// Type definition for component props.
type Props = {
  buildingDetails: Building,
};

// Type definition for component state.
type State = {
  buildingRooms: ListView.DataSource,
  loaded: boolean,
};

// Imports
const Constants = require('../../Constants');
const DisplayUtils = require('../../util/DisplayUtils');
const LanguageUtils = require('../../util/LanguageUtils');
const MaterialIcons = require('react-native-vector-icons/MaterialIcons');
const Preferences = require('../../util/Preferences');
const SearchManager = require('../../util/SearchManager');
const SectionHeader = require('../../components/SectionHeader');

const {width} = Dimensions.get('window');
const screenWidth: number = width;

// Listener for search input
let buildingSearchListener: ?SearchListener = null;

// Size of room buttons
const ROOM_MARGIN: number = 10;
const ROOM_WIDTH: number = (screenWidth - ROOM_MARGIN * 2) / 2;

/* eslint-disable no-magic-numbers */
/* Not worried about the magic number in the array definition below */

// Defines how rooms will be colored.
const LENGTH_OF_ROOM_PATTERN: number = 4;
const DARKENED_ROOMS: Array<number> = [
  0,
  3,
];

/* eslint-enable no-magic-numbers */

class BuildingPage extends React.Component {

  /**
   * Properties which the parent component should make available to this component.
   */
  static propTypes = {
    buildingDetails: React.PropTypes.any.isRequired,
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
      buildingRooms: new ListView.DataSource({
        rowHasChanged: (r1, r2) => r1 !== r2,
      }),
      loaded: false,
    };

    // Explicitly bind 'this' to methods that require it
    (this:any)._onBuildingSearch = this._onBuildingSearch.bind(this);
  }

  /**
   * Loads the links to display, registers the search listener.
   */
  componentDidMount(): void {
    SearchManager.addSearchListener(this._getBuildingSearchListener());

    if (!this.state.loaded) {
      this._parseBuildingRooms();
    }
  }

  /**
   * Removes the search listener.
   */
  componentWillUnmount(): void {
    SearchManager.removeSearchListener(this._getBuildingSearchListener());
  }

  /**
   * Gets an object containing the search listener method. If the object does not exist yet, it is created and returned
   * from that time on.
   *
   * @returns {SearchListener} the building search listener
   */
  _getBuildingSearchListener(): SearchListener {
    if (buildingSearchListener == null) {
      buildingSearchListener = {
        onSearch: this._onBuildingSearch,
      };
    }

    return buildingSearchListener;
  }

  /**
   * Returns a list of touchable views which describe facilities in the building.
   *
   * @param {Object} Translations translations in the current language of certain text.
   * @returns {ReactElement<any>} an icon representing each of the facilities in this building
   */
  _getFacilityIcons(Translations: Object): ReactElement<any> {
    return (
      <View style={_styles.facilitiesContainer}>
        {this.props.buildingDetails.facilities.map(facility => {
          return (
            <TouchableOpacity
                key={facility}
                onPress={() => this._openFacilityDescription(facility, Translations)}>
              <MaterialIcons
                  color={'white'}
                  name={DisplayUtils.getFacilityIconName(facility, Translations)}
                  size={30}
                  style={_styles.facilitiesIcon} />
            </TouchableOpacity>
          );
        })}
      </View>
    );
  }

  /**
   * Returns a list of touchable views listing the room names.
   *
   * @returns {ReactElement<any>} a ScrollView containing a ListView.
   */
  _getRoomList(): ReactElement<any> {
    return (
      <ListView
          contentContainerStyle={_styles.roomList}
          dataSource={this.state.buildingRooms}
          renderRow={this._renderRow.bind(this)} />
    );
  }

  /**
   * Displays a pop-up to the user, describing what a certain facility icon means.
   *
   * @param {Facility} facility   id of the facility
   * @param {Object} Translations translations in the current language of certain text.
   */
  _openFacilityDescription(facility: Facility, Translations: Object): void {
    Alert.alert(
      Translations.whats_this_icon,
      Translations[facility],
    );
  }

  /**
   * Retrieves a ListView.DataSource from the array containing the building's rooms.
   */
  _parseBuildingRooms(): void {
    this.setState({
      buildingRooms: this.state.buildingRooms.cloneWithRows(this.props.buildingDetails.rooms),
    });
  }

  /**
   * Filters the rooms in the building and displays them to the user.
   *
   * @param {string} searchTerms user input filter terms.
   */
  _onBuildingSearch(searchTerms: ?string): void {
    if (searchTerms == null || searchTerms.length === 0) {
      this.setState({
        buildingRooms: this.state.buildingRooms.cloneWithRows(this.props.buildingDetails.rooms),
      });

      return;
    }

    // Ignore the case of the search terms
    const adjustedSearchTerms = searchTerms.toUpperCase();

    const filteredRooms: Array<BuildingRoom> = [];
    const rooms: Array<BuildingRoom> = this.props.buildingDetails.rooms;
    for (let i = 0; i < rooms.length; i++) {
      if (rooms[i].name.toUpperCase().indexOf(adjustedSearchTerms) >= 0) {
        filteredRooms.push(rooms[i]);
      }
    }

    this.setState({
      buildingRooms: this.state.buildingRooms.cloneWithRows(filteredRooms),
    });
  }

  /**
   * Renders an item describing a single room in the building.
   *
   * @param {BuildingRoom} room the identifier of the room.
   * @param {string} sectionId  index of the section the room is in.
   * @param {number} rowIndex   index of the row the room is in.
   * @returns {ReactElement<any>} a view describing a room.
   */
  _renderRow(room: BuildingRoom, sectionId: string, rowIndex: number): ReactElement<any> {
    let rowColor: string = Constants.Colors.garnet;
    const rowPosition = rowIndex % LENGTH_OF_ROOM_PATTERN;
    if (DARKENED_ROOMS.indexOf(rowPosition) >= 0) {
      rowColor = Constants.Colors.defaultComponentBackgroundColor;
    }

    return (
      <TouchableOpacity>
        <View style={{width: ROOM_WIDTH, backgroundColor: rowColor}}>
          <Text style={_styles.room}>
            {room.name}
          </Text>
        </View>
      </TouchableOpacity>
    );
  }

  /**
   * Renders a view containing an image of the building, it's name, and a list of its rooms and facilities.
   *
   * @returns {ReactElement<any>} a view describing a building.
   */
  render(): ReactElement<any> {
    // Get current language for translations
    let Translations: Object = {};
    if (Preferences.getSelectedLanguage() === 'fr') {
      Translations = require('../../../assets/js/Translations.fr.js');
    } else {
      Translations = require('../../../assets/js/Translations.en.js');
    }

    const building = this.props.buildingDetails;
    const facilityIcons: ReactElement<any> = this._getFacilityIcons(Translations);
    const roomList: ReactElement<any> = this._getRoomList();

    return (
      <View style={_styles.container}>
        <ScrollView
            keyboardDismissMode={'on-drag'}
            style={_styles.scrollView}>
          <View style={_styles.banner}>
            <Image
                resizeMode={'cover'}
                source={this.props.buildingDetails.image}
                style={_styles.bannerImage} />
          </View>
          {facilityIcons}
          {roomList}
        </ScrollView>
        <SectionHeader
            sectionName={LanguageUtils.getTranslatedName(Preferences.getSelectedLanguage(), building)}
            subtitleName={building.code} />
      </View>
    );
  }
}

// Private styles for component
const _styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  banner: {
    height: 175,
  },
  bannerImage: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    width: null,
    height: null,
  },
  scrollView: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  },
  facilitiesContainer: {
    backgroundColor: Constants.Colors.defaultComponentBackgroundColor,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    width: screenWidth,
  },
  facilitiesIcon: {
    margin: 10,
  },
  roomList: {
    margin: 10,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  room: {
    margin: 15,
    alignSelf: 'center',
    color: Constants.Colors.primaryWhiteText,
    fontSize: Constants.Text.Medium,
  },
});

module.exports = BuildingPage;

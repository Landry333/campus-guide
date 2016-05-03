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
 * @file ShuttleCampusInfo.js
 * @module ShuttleCampusInfo
 * @description Displays details about the departure times of the shuttle from a
 *              single campus.
 * @flow
 *
 */
'use strict';

// React Native imports
const React = require('react-native');
const {
  Component,
  Image,
  StyleSheet,
  View,
} = React;

// Import type definitions
import type {
  LatLong,
  ShuttleCampus,
  University,
} from '../../Types';

// Imports
const Configuration = require('../../util/Configuration');
const Constants = require('../../Constants');
const DisplayUtils = require('../../util/DisplayUtils');
const LanguageUtils = require('../../util/LanguageUtils');
const MapView = require('react-native-maps');
const Preferences = require('../../util/Preferences');

// Type definition for component props.
type Props = {
  campusName: string,
  campusColor: string,
};

// Type definition for component state.
type State = {
  campus: ?ShuttleCampus,
  region: ?LatLong,
};

class ShuttleCampusInfo extends Component {
  state: State;

  /**
   * Properties which the parent component should make available to this
   * component.
   */
  static propTypes = {
    campusName: React.PropTypes.string.isRequired,
    campusColor: React.PropTypes.string.isRequired,
  };

  /**
   * Pass props and declares initial state.
   *
   * @param {Props} props properties passed from container to this component.
   */
  constructor(props: Props) {
    super(props);

    this.state = {
      campus: null,
      region: null,
    };

    // Explicitly binding 'this' to all methods that need it
    (this:any)._getCampusMap = this._getCampusMap.bind(this);
    (this:any)._loadCampusInfo = this._loadCampusInfo.bind(this);
  };

  /**
   * Renders a map with a list of markers to denote bus stops near the campus.
   *
   * @param {Object} Translations translations in the current language of certain text.
   * @return {ReactElement} a map view with a marker
   */
  _getCampusMap(Translations: Object): ReactElement {
    let initialRegion: LatLong;
    let marker: ?ReactElement;

    if (this.state.campus == null) {
      let university: ?University = Configuration.getUniversity();
      if (university != null) {
        initialRegion = {
          latitude: university.lat,
          longitude: university.long,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        };
      }
    } else {
      let lat = this.state.campus.lat;
      let long = this.state.campus.lat;
      initialRegion = {
        latitude: lat,
        longitude: long,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      };

      marker = (
        <MapView.Marker
            coordinate={initialRegion}
            description={LanguageUtils.getTranslatedName(Preferences.getSelectedLanguage(), this.state.campus)}
            title={Translations['shuttle_stop']}>
        </MapView.Marker>
      );
    }

    return (
      <MapView
          style={_styles.map}
          region={initialRegion}>
        {marker}
      </MapView>
    );
  };

  /**
   * Retrieves data about the campus provided as this.props.campusName.
   */
  _loadCampusInfo(): void {
    let campuses: Array<ShuttleCampus> = require('../../../assets/static/json/shuttle.json');
    if (this.props.campusName in campuses) {
      this.setState({
        campus: campuses[this.props.campusName],
      });
    }
  };

  /**
   * If the campus info has not been loaded yet, then load it.
   */
  componentDidMount(): void {
    if (this.state.campus == null) {
      this._loadCampusInfo();
    }
  };

  /**
   * Renders a map and details about the shuttle drop off times at the campus
   * specified by {this.props.campusName}.
   *
   * @return {ReactElement} the hierarchy of views to render.
   */
  render(): ReactElement {
    // Get current language for translations
    let Translations: Object;
    if (Preferences.getSelectedLanguage() === 'fr') {
      Translations = require('../../../assets/static/js/Translations.fr.js');
    } else {
      Translations = require('../../../assets/static/js/Translations.en.js');
    }

    return (
      <View style={[_styles.container, {backgroundColor: this.props.campuscolor}]}>
        <View style={_styles.mapContainer}>
          {this._getCampusMap(Translations)}
        </View>
        <View style={_styles.timeContainer} />
      </View>
    );
  };
};

// Private styles for the component
const _styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  mapContainer: {
    flex: 3,
  },
  timeContainer: {
    flex: 4,
  },
  map: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
});

// Expose component to app
module.exports = ShuttleCampusInfo;

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
 * @file NavigationHome.js
 * @providesModule NavigationHome
 * @description Allows the user to confirm their starting and ending location for navigation.
 *
 * @flow
 */
'use strict';

// React imports
import React from 'react';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';

// Type imports
import type {
  CampusDestination,
} from 'types';

// Type definition for component props.
type Props = {
  destination: CampusDestination,
}

class NavigationHome extends React.Component {

  /**
   * Properties which the parent component should make available to this component.
   */
  static propTypes = {
    destination: React.PropTypes.object.isRequired,
  };

  constructor(props: Props) {
    super(props);

    // Explicitly bind 'this' to methods that require it
    (this:any)._isDestinationBuilding = this._isDestinationBuilding.bind(this);
  }

  /**
   * Returns true if the destination for navigation is a building, false if it is a room.
   *
   * @returns {boolean} true if this.props.destination.roomName is null or undefined, false otherwise
   */
  _isDestinationBuilding(): boolean {
    return this.props.destination.roomName != null;
  }

  /**
   * Renders the user's upcoming classes for the day and a list of buildings on campus.
   *
   * @returns {ReactElement<any>} the hierarchy of views to render.
   */
  render(): ReactElement<any> {
    return (
      <View style={_styles.container}>
        <Text>{this.props.destination.buildingCode}</Text>
        <Text>{this.props.destination.roomName}</Text>
      </View>
    );
  }
}

// Private styles for component
const _styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

module.exports = NavigationHome;

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
 * @created 2017-03-03
 * @file PaddedIcon.tsx
 * @description Renders an icon, centered in a view for which the width can be defined, for consistent widths
 */
'use strict';

// React imports
import React from 'react';
import {
  StyleSheet,
  View,
} from 'react-native';

// Types
import { BasicIcon } from '../../typings/global';

interface Props {
  color?: string | undefined;   // Color of the icon, default is white
  icon: BasicIcon | undefined;  // Large icon to represent the section
  size?: number | undefined;    // Size of the icon, or Constants.Sizes.Icons.Medium
  style?: any;                  // View style
  width?: number;               // Width of parent container, or DEFAULT_WIDTH
}

// Imports
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import * as Constants from '../constants';

// 16 left padding + 16 right padding + 24 icon size
export const DefaultWidth = 56;

/**
 * Renders the icon, centred in the parent view
 *
 * @param {Props} props props to render component
 * @returns {JSX.Element} hierarchy of views to render
 */
export default function render(props: Props): JSX.Element {
  let icon: JSX.Element | undefined;
  if (props.icon && props.icon.class === 'material') {
    icon = (
      <MaterialIcons
          color={props.color || Constants.Colors.primaryWhiteIcon}
          name={props.icon.name}
          size={props.size || Constants.Sizes.Icons.Medium} />
    );
  } else if (props.icon && props.icon.class === 'ionicon') {
    icon = (
      <Ionicons
          color={props.color || Constants.Colors.primaryWhiteIcon}
          name={props.icon.name}
          size={props.size || Constants.Sizes.Icons.Medium} />
    );
  }

  return (
    <View style={[ _styles.iconContainer, { width: props.width || DefaultWidth }, props.style]}>
      {icon}
    </View>
  );
}

// Private styles for component
const _styles = StyleSheet.create({
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

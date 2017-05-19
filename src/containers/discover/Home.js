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
 * @created 2016-10-27
 * @file Home.js
 * @description Root view for info which help users become acquainted with the school.
 *
 * @flow
 */
'use strict';

// React imports
import React from 'react';
import { StyleSheet, View } from 'react-native';

// Redux imports
import { connect } from 'react-redux';
import * as actions from 'actions';

// Types
import type { MenuSection, Language } from 'types';

// Type definition for component props.
type Props = {
  language: Language,                           // The current language, selected by the user
  onSectionSelected: (section: string) => void, // Display contents of the section in new view
}

// Type definition for component state.
type State = {
  sections: Array < MenuSection >,  // Sections in the discover section
};

// Imports
import Menu from 'Menu';
import * as Configuration from 'Configuration';
import * as Constants from 'Constants';

class DiscoverHome extends React.Component {

  /**
   * Properties this component expects to be provided by its parent.
   */
  props: Props

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
      sections: [],
    };
  }

  /**
   * If the sections have not been loaded, then load them.
   */
  componentDidMount(): void {
    if (this.state.sections.length === 0) {
      Configuration.init()
          .then(() => Configuration.getConfig('/discover.json'))
          .then((sections: Array < MenuSection >) => this.setState({ sections }))
          .catch((err: any) => console.error('Configuration could not be initialized for discovery.', err));
    }
  }

  /**
   * Renders each of the sections, with one of them focused and showing an image.
   *
   * @returns {ReactElement<any>} the hierarchy of views to render.
   */
  render(): ReactElement < any > {
    return (
      <View style={_styles.container}>
        <Menu
            language={this.props.language}
            sections={this.state.sections}
            onSectionSelected={this.props.onSectionSelected} />
      </View>
    );
  }
}

// Private styles for component
const _styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Constants.Colors.primaryBackground,
  },
});

const mapStateToProps = (store) => {
  return {
    language: store.config.options.language,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onSectionSelected: (section: string) => {
      let view: number = Constants.Views.Discover.Home;
      let title: ?string = null;

      switch (section) {
        case 'hou':
          view = Constants.Views.Discover.Housing;
          title = 'housing';
          break;
        case 'use':
          view = Constants.Views.Discover.Links;
          title = 'useful_links';
          dispatch(actions.switchLinkCategory(0));
          break;
        case 'trn':
          view = Constants.Views.Discover.Transit;
          title = 'transit_company';
          break;
        case 'shu':
          view = Constants.Views.Discover.Shuttle;
          title = 'shuttle';
          break;
        case 'stu':
          view = Constants.Views.Discover.StudySpots;
          title = 'study_spots';
          break;
        default:
          // Does nothing
          // Return to default view, Views.Home
      }

      dispatch(actions.setHeaderTitle(title, 'discover'));
      dispatch(actions.switchDiscoverView(view));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(DiscoverHome);

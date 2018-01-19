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
 * @created 2016-10-19
 * @file Home.tsx
 * @description Provides the user with details on navigating the campus.
 */
'use strict';

// React imports
import React from 'react';
import { StyleSheet, View } from 'react-native';

// Redux imports
import { connect } from 'react-redux';
import * as actions from '../../actions';

// Imports
import ImageGrid from '../../components/ImageGrid';
import Header from '../../components/Header';
import * as Analytics from '../../util/Analytics';
import * as Constants from '../../constants';
import * as Translations from '../../util/Translations';

// Types
import { Store } from '../../store/configureStore';
import { Language } from '../../util/Translations';
import { Name } from '../../../typings/global';
import { Building } from '../../../typings/university';

interface Props {
  buildingList: Building[];                     // List of buildings to display
  filter: string;                               // The current filter for buildings
  language: Language;                           // The current language, selected by the user
  onBuildingSelect(b: Building, n: Name): void; // Updates the state when a building is selected
}

interface State {}

// Number of columns to display in building grid
const BUILDING_COLUMNS = 3;

class FindHome extends React.PureComponent<Props, State> {

  /**
   * Loads a view to display details about a building.
   *
   * @param {Building|undefined} building object describing the building
   */
  _onBuildingSelect(building: Building | undefined): void {
    if (building != undefined) {
      const name = {
        name_en: Translations.getEnglishName(building) || '',
        name_fr: Translations.getFrenchName(building) || '',
      };

      const index = this.props.buildingList.indexOf(building);
      Analytics.buildingSelected(building.shorthand, { index });

      this.props.onBuildingSelect(building, name);
    }
  }

  /**
   * Renders the user's upcoming classes for the day and a list of buildings on campus.
   *
   * @returns {JSX.Element} the hierarchy of views to render
   */
  render(): JSX.Element {
    return (
      <View style={_styles.container}>
        <View style={_styles.headerContainer}>
          <Header
              icon={{ name: 'store', class: 'material' }}
              title={Translations.get('building_directory')} />
        </View>
        <View style={_styles.container}>
          <ImageGrid
              columns={BUILDING_COLUMNS}
              filter={this.props.filter}
              images={this.props.buildingList}
              language={this.props.language}
              onSelect={this._onBuildingSelect.bind(this)} />
        </View>
      </View>
    );
  }
}

// Private styles for component
const _styles = StyleSheet.create({
  container: {
    backgroundColor: Constants.Colors.secondaryBackground,
    flex: 1,
  },
  headerContainer: {
    backgroundColor: Constants.Colors.primaryBackground,
  },
});

const mapStateToProps = (store: Store): any => {
  return {
    filter: store.search.tabTerms.find,
    language: store.config.options.language,
  };
};

const mapDispatchToProps = (dispatch: any): any => {
  return {
    onBuildingSelect: (building: Building, buildingName: Name): any => {
      dispatch(actions.setHeaderTitle(buildingName, 'find', Constants.Views.Find.Building));
      dispatch(actions.viewBuilding(building));
      dispatch(actions.switchFindView(Constants.Views.Find.Building));
      dispatch(actions.search('find', ''));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(FindHome) as any;

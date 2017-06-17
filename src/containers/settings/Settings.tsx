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
 * @created 2016-11-6
 * @file Settings.tsx
 * @description View to allow the user to see and update their settings and preferences.
 */
'use strict';

// React imports
import React from 'react';
import {
  Alert,
  Clipboard,
  Linking,
  Modal,
  Platform,
  SectionList,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

// Redux imports
import { connect } from 'react-redux';
import * as actions from '../../actions';

// Imports
import DeviceInfo from 'react-native-device-info';
import Header from '../../components/Header';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import ModalHeader from '../../components/ModalHeader';
import * as Configuration from '../../util/Configuration';
import * as Constants from '../../constants';
import * as Display from '../../util/Display';
import * as External from '../../util/External';
import * as TextUtils from '../../util/TextUtils';
import * as Translations from '../../util/Translations';

// Types
import { Language } from '../../util/Translations';
import { Icon, Link, Name, Section, TimeFormat } from '../../../typings/global';
import { Semester } from '../../../typings/university';

interface Props {
  currentSemester: number;                              // The current semester, selected by the user
  language: Language;                                   // The current language, selected by the user
  prefersWheelchair: boolean;                           // Whether the user prefers wheelchair accessible routes
  semesters: Semester[];                                // Semesters available at the university
  timeFormat: TimeFormat;                               // The user's preferred time format
  updateConfiguration(o: Configuration.Options): void;  // Update the global configuration state
}

interface State {
  loaded: boolean;            // Indicates if the settings have been loaded
  listModalSections: any[];   // List of data to display in modal
  listModalTitle: string;     // Title of the list view modal
  listModalVisible: boolean;  // Indicates if the list modal should be visible
}

/** Setting for the app */
interface Setting extends Link, Name {
  icon?: Icon;  // Icon for the setting
  key: string;  // Unique key to identify the setting
  type: string; // Type of setting
}

// Default opacity for tap when setting is not a boolean
const DEFAULT_OPACITY = 0.4;

class Settings extends React.PureComponent<Props, State> {

  /** List of sections of settings to render. */
  _settingSections: Section < Setting >[] = [];

  /** Cache of settings values to retrieve and update them quickly. */
  _settingsCache: any = {};

  /**
   * Constructor.
   *
   * @param {props} props component props
   */
  constructor(props: Props) {
    super(props);
    this.state = {
      listModalSections: [],
      listModalTitle: '',
      listModalVisible: false,
      loaded: false,
    };
  }

  /**
   * Loads the settings once the view has been mounted.
   */
  componentDidMount(): void {
    Configuration.init()
        .then(() => Translations.loadTranslations('en'))
        .then(() => Translations.loadTranslations('fr'))
        .then(() => Configuration.getConfig('/settings.json'))
        .then((settingSections: Section < Setting >[]) => {
          const totalSections = settingSections.length;
          for (let i = 0; i < totalSections; i++) {
            const section = settingSections[i];
            const totalRows = section.data.length;
            for (let j = 0; j < totalRows; j++) {
              const row = section.data[j];
              this._settingsCache[row.key] = this._getSetting(row.key);
            }
          }

          this._settingSections = settingSections;
          this.setState({ loaded: true });
        })
        .catch((err: any) => console.error('Configuration could not be initialized for settings.', err));
  }

  /**
   * Unloads the unused language.
   */
  componentWillUnmount(): void {
    Translations.unloadTranslations(this.props.language === 'en' ? 'fr' : 'en');
  }

  /**
   * Returns true if the current value of a setting does not match its cached value, and updates the cached value if so.
   *
   * @param {string} key identifier for the setting to check
   * @returns {boolean} true if the value in the cache was updated
   */
  _checkChangedSetting(key: string): boolean {
    const settingValue = this._getSetting(key);
    const changed = this._settingsCache[key] !== settingValue;

    if (changed) {
      this._settingsCache[key] = settingValue;
    }

    return changed;
  }

  /**
   * Closes all modals.
   */
  _closeModal(): void {
    this.setState({
      listModalSections: [],
      listModalVisible: false,
    });
  }

  /**
   * Returns the value of a setting based on the provided key. The returned value may be a string, boolean, integer,
   * or object, and should correspond to the type of the setting.
   *
   * @param {string} key the setting value to return
   * @returns {any} the value of the setting corresponding to {key}, or null
   */
  _getSetting(key: string): any {
    switch (key) {
      case 'pref_lang':
        return (this.props.language === 'en')
          ? 'English'
          : 'Français';
      case 'pref_wheel':
        return this.props.prefersWheelchair;
      case 'pref_semester': {
        const semester = this.props.semesters[this.props.currentSemester];

        return Translations.getName(this.props.language, semester);
      }
      case 'pref_time_format':
        return this.props.timeFormat;
      case 'app_version':
        return DeviceInfo.getVersion();
      default:
        return undefined;
    }
  }

  /**
   * Updates the setting for the row pressed.
   *
   * @param {any}  setting   setting that was pressed
   * @param {boolean} tappedRow indicates if the row was tapped, or another area
   */
  _onPressRow(setting: any, tappedRow: boolean): void {
    if (setting.type === 'boolean' && tappedRow) {
      // Ignore boolean settings, they can only be manipulated by switch
      return;
    } else if (setting.type === 'link' && setting.key !== 'app_open_source') {
      // Open the provided link
      const link = Translations.getLink(this.props.language, setting);
      External.openLink(
        link || External.getDefaultLink(),
        this.props.language,
        Linking,
        Alert,
        Clipboard,
        TextUtils
      );

      return;
    }

    switch (setting.key) {
      case 'pref_lang':
        this.props.updateConfiguration({ language: this.props.language === 'en' ? 'fr' : 'en' });
        break;
      case 'pref_wheel':
        this.props.updateConfiguration({ prefersWheelchair: !this.props.prefersWheelchair });
        break;
      case 'pref_semester':
        let nextSemester = this.props.currentSemester + 1;
        if (nextSemester >= this.props.semesters.length) {
          nextSemester = 0;
        }
        this.props.updateConfiguration({ currentSemester: nextSemester });
        break;
      case 'pref_time_format':
        this.props.updateConfiguration({ preferredTimeFormat: this.props.timeFormat === '12h' ? '24h' : '12h' });
        break;
      case 'app_open_source':
        const licenses = require('../../../assets/json/licenses.json');
        this.setState({
          listModalSections: licenses,
          listModalTitle: Translations.getName(this.props.language, setting) || '',
          listModalVisible: true,
        });
        break;
      default:
        // Does nothing
    }
  }

  /**
   * Renders content for the list view modal.
   *
   * @returns {JSX.Element} a list view with the rows and sections loaded
   */
  _renderListModal(): JSX.Element {
    return (
      <View style={[ _styles.container, { backgroundColor: Constants.Colors.primaryBackground }]}>
        <ModalHeader
            backgroundColor={Constants.Colors.primaryBackground}
            rightActionEnabled={true}
            rightActionText={Translations.get(this.props.language, 'done')}
            title={this.state.listModalTitle}
            onRightAction={this._closeModal.bind(this)} />
        <SectionList
            renderItem={this._renderListModalRow.bind(this)}
            renderSectionHeader={this._renderListModalSectionHeader.bind(this)}
            sections={this.state.listModalSections}
            style={_styles.modalList} />
      </View>
    );
  }

  /**
   * Displays a single row, representing an item in the list view.
   *
   * @param {any} item item text to be rendered
   * @returns {JSX.Element} views to render the setting in the list
   */
  _renderListModalRow({ item }: { item: any }): JSX.Element {
    return (
      <Text style={_styles.modalListText}>{item.text}</Text>
    );
  }

  /**
   * Renders a heading for a section in the modal list.
   *
   * @param {Section<any>} section section contents
   * @returns {JSX.Element} a {Header} with the name of the section
   */
  _renderListModalSectionHeader({ section }: { section: Section<any> }): JSX.Element {
    return (
      <View style={_styles.modalListHeader}>
        <Header title={section.key} />
      </View>
    );
  }

  /**
   * Displays a single item, representing a setting which can be changed.
   *
   * @param {Setting} setting defines the setting contents to render
   * @returns {JSX.Element} views to render the setting in the list
   */
  _renderItem({ item }: { item: Setting }): JSX.Element {
    let content;
    switch (item.type) {
      case 'multi':
      case 'text':
        content = (
          <View style={_styles.settingContent}>
            <Text style={_styles.settingValue}>{this._getSetting(item.key)}</Text>
          </View>
        );
        break;
      case 'boolean':
        content = (
          <View style={_styles.settingContent}>
            <Switch
                value={this._getSetting(item.key)}
                onValueChange={(): void => this._onPressRow(item, false)} />
          </View>
        );
        break;
      case 'link':
        const icon = Display.getPlatformIcon(Platform.OS, item);
        if (icon != undefined) {
          content = (
            <View style={_styles.settingContent}>
              {icon.class === 'ionicon'
                ? <Ionicons
                    color={Constants.Colors.primaryBlackIcon}
                    name={icon.name}
                    size={Constants.Sizes.Icons.Medium} />
                : <MaterialIcons
                    color={Constants.Colors.primaryBlackIcon}
                    name={icon.name}
                    size={Constants.Sizes.Icons.Medium} />}
            </View>
          );
        }
        break;
      default:
        // Does nothing
    }

    return (
      <View style={_styles.settingContainer}>
        <TouchableOpacity
            activeOpacity={item.type === 'boolean' ? 1 : DEFAULT_OPACITY}
            onPress={this._onPressRow.bind(this, item, true)}>
          <View style={_styles.setting}>
            <Text style={_styles.settingText}>{Translations.getName(this.props.language, item)}</Text>
            {content}
          </View>
        </TouchableOpacity>
      </View>
    );
  }

  /**
   * Renders a heading for a section of settings.
   *
   * @param {Section<any>} section section contents
   * @returns {JSX.Element} a {Header} with the name of the section
   */
  _renderSectionHeader({ section }: { section: Section <any> }): JSX.Element {
    const colonIndex: number = section.key.indexOf(':');
    let sectionNameTranslated = section.key;
    if (colonIndex > -1) {
      sectionNameTranslated = (this.props.language === 'en')
          ? section.key.substring(0, colonIndex)
          : section.key.substring(colonIndex + 1);
    }

    return (
      <Header
          backgroundColor={Constants.Colors.lightGrey}
          title={sectionNameTranslated} />
    );
  }

  /**
   * Renders row separator.
   *
   * @returns {JSX.Element} a separator styled view
   */
  _renderSeparator(): JSX.Element {
    return <View style={_styles.separator} />;
  }

  /**
   * Displays a list of settings.
   *
   * @returns {JSX.Element} the hierarchy of views to render
   */
  render(): JSX.Element {
    return (
      <View style={_styles.container}>
        <Modal
            animationType={'slide'}
            transparent={false}
            visible={this.state.listModalVisible}
            onRequestClose={this._closeModal.bind(this)}>
          {this._renderListModal()}
        </Modal>
        <SectionList
            ItemSeparatorComponent={this._renderSeparator}
            renderItem={this._renderItem.bind(this)}
            renderSectionHeader={this._renderSectionHeader.bind(this)}
            sections={this._settingSections} />
      </View>
    );
  }
}

// Private styles for component
const _styles = StyleSheet.create({
  container: {
    backgroundColor: Constants.Colors.tertiaryBackground,
    flex: 1,
  },
  modalList: {
    backgroundColor: Constants.Colors.secondaryBackground,
  },
  modalListHeader: {
    backgroundColor: Constants.Colors.secondaryBackground,
  },
  modalListText: {
    color: Constants.Colors.primaryWhiteText,
    fontSize: Constants.Sizes.Text.Caption,
    margin: Constants.Sizes.Margins.Expanded,
  },
  separator: {
    backgroundColor: Constants.Colors.darkTransparentBackground,
    height: StyleSheet.hairlineWidth,
    marginLeft: Constants.Sizes.Margins.Expanded,
  },
  setting: {
    alignItems: 'center',
    backgroundColor: Constants.Colors.tertiaryBackground,
    flexDirection: 'row',
    height: 50,
  },
  settingContainer: {
    backgroundColor: Constants.Colors.secondaryBackground,
  },
  settingContent: {
    height: 50,
    justifyContent: 'center',
    position: 'absolute',
    right: 20,
  },
  settingText: {
    color: Constants.Colors.primaryBlackText,
    fontSize: Constants.Sizes.Text.Body,
    marginLeft: Constants.Sizes.Margins.Expanded,
  },
  settingValue: {
    color: Constants.Colors.primaryBlackText,
    fontSize: Constants.Sizes.Text.Body,
  },
});

const mapStateToProps = (store: any): any => {
  return {
    currentSemester: store.config.options.currentSemester,
    language: store.config.options.language,
    prefersWheelchair: store.config.options.prefersWheelchair,
    semesters: store.config.options.semesters,
    timeFormat: store.config.options.preferredTimeFormat,
  };
};

const mapDispatchToProps = (dispatch: any): any => {
  return {
    updateConfiguration: (options: Configuration.Options): any => dispatch(actions.updateConfiguration(options)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Settings) as any;

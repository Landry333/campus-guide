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
 * @created 2016-10-29
 * @file Home.js
 * @description Root view for info which help users become acquainted with the school.
 *
 * @flow
 */
'use strict';

// React imports
import React from 'react';
import {
  Alert,
  Clipboard,
  Dimensions,
  Image,
  Linking,
  Navigator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

// Redux imports
import {connect} from 'react-redux';
import {
  setDiscoverLinks,
} from 'actions';

// Type imports
import type {
  Language,
  LinkSection,
  NamedLink,
  Route,
} from 'types';

// Imports
import Header from 'Header';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Menu from 'Menu';
import * as Configuration from 'Configuration';
import * as Constants from 'Constants';
import * as DisplayUtils from 'DisplayUtils';
import * as ExternalUtils from 'ExternalUtils';
import * as TextUtils from 'TextUtils';
import * as TranslationUtils from 'TranslationUtils';

// Used to determine maximum length of link titles
const TEXT_PADDING = 100;
const screenWidth = Dimensions.get('window').width;

class Links extends React.Component {

  /**
   * Properties this component expects to be provided by its parent.
   */
  props: {
    language: Language,                                        // The current language, selected by the user
    onSectionsLoaded: (links: Array < LinkSection >) => void,  // Sets the sections in the view
    links: Array < LinkSection >,                              // The sections in the view
  }

  /**
   * If the sections have not been loaded, then load them.
   */
  componentDidMount(): void {
    if (this.props.links == null || this.props.links.length === 0) {
      Configuration.init()
          .then(() => Configuration.getConfig('/useful_links.json'))
          .then((linkSections: Array < LinkSection >) => {
            this.props.onSectionsLoaded(linkSections);
          })
          .catch((err: any) => console.error('Configuration could not be initialized for useful links.', err));
    }
  }

  /**
   * Sets the transition between two views in the navigator.
   *
   * @returns {Object} a configuration for the transition between scenes.
   */
  _configureScene(): Object {
    return Navigator.SceneConfigs.PushFromRight;
  }

  /**
   * Constructs a view to display a formatted link, if the link does not begin with "http".
   *
   * @param {string} link      the link to format
   * @param {string} textColor color of the text to display link in.
   * @returns {?ReactElement<any>} a formatted link in a text view.
   */
  _getFormattedLink(link: string, textColor: string): ?ReactElement < any > {
    if (link.indexOf('http') === 0) {
      return null;
    } else {
      return (
        <Text style={[_styles.linkSubtitle, {color: textColor}]}>{TextUtils.formatLink(link)}</Text>
      );
    }
  }

  /**
   * Gets an icon based on the link type.
   *
   * @param {?string} link     the link to represent with an icon.
   * @param {string} iconColor color for the icon.
   * @returns {?ReactElement<any>} an icon for the link.
   */
  _getLinkIcon(link: ?string, iconColor: string): ?ReactElement < any > {
    if (link == null) {
      return null;
    }

    let iconName: string;
    if (link.indexOf('tel:') === 0) {
      iconName = 'md-call';
    } else if (link.indexOf('mailto:') === 0) {
      iconName = 'md-mail';
    } else {
      iconName = 'md-open';
    }

    return (
      <Ionicons
          color={iconColor}
          name={iconName}
          size={Constants.Sizes.Icons.Medium}
          style={_styles.linkIcon} />
    );
  }

  /**
   * Attempts to open a URL.
   *
   * @param {?string} link        the url to open.
   * @param {Object} Translations language translations.
   */
  _openLink(link: ?string, Translations: Object): void {
    ExternalUtils.openLink(link, Translations, Linking, Alert, Clipboard);
  }

  /**
   * Push a new route onto the stack.
   *
   * @param {string} id the id of the category to display
   */
  _onCategorySelected(id: string): void {
    const currentRoutes = this.refs.Navigator.getCurrentRoutes();
    if (currentRoutes != null && currentRoutes.length > 1) {
      this.refs.Navigator.push({id: currentRoutes[currentRoutes.length - 1].id + '-' + id});
    } else {
      this.refs.Navigator.push({id: id});
    }
  }

  /**
   * Renders a header image for the section links.
   *
   * @param {LinkSection} section category to display
   * @returns {ReactElement<any>} an image and title for the section
   */
  _renderSectionBanner(section: LinkSection): ReactElement < any > {
    return (
      <View style={_styles.banner}>
        <Image
            resizeMode={'cover'}
            source={{uri: Configuration.getImagePath(section.image)}}
            style={_styles.bannerImage} />
        <View style={_styles.bannerTextContainer}>
          <Text style={_styles.bannerText}>
            {TranslationUtils.getTranslatedName(this.props.language, section)}
          </Text>
        </View>
      </View>
    );
  }

  /**
   * Returns a list of touchable views which lead to new pages of categories of links.
   *
   * @param {Array<LinkSection>} categories       subcategories of links
   * @param {boolean}            isBackgroundDark indicates if the background color of the category is dark
   * @returns {?ReactElement<any>} for each index in categories, a TouchableOpacity with the name of the category,
   *                               or null if there are no categories
   */
  _renderSectionCategories(categories: Array < LinkSection >, isBackgroundDark: boolean): ?ReactElement < any > {
    if (categories == null) {
      return null;
    }

    const language: Language = this.props.language;
    const dividerColor: string = (isBackgroundDark)
        ? Constants.Colors.primaryWhiteText
        : Constants.Colors.primaryBlackText;

    return (
      <View>
        {categories.map((category: LinkSection, index: number) => {
          const categoryName = TranslationUtils.getTranslatedName(language, category);
          if (categoryName == null) {
            return null;
          }

          return (
            <TouchableOpacity
                key={categoryName}
                onPress={() => this._onCategorySelected(category.id)}>
              <Header
                  icon={{name: 'chevron-right', class: 'material'}}
                  title={categoryName} />
              {(index < categories.length - 1)
                ? <View style={[_styles.divider, {backgroundColor: dividerColor}]} />
                : null
              }
            </TouchableOpacity>
          );
        })}
      </View>
    );
  }

  /**
   * Returns a list of touchable views which open links in the web browser.
   *
   * @param {Array<NamedLink>} links            list of links in the current category.
   * @param {boolean}          isBackgroundDark indicates if the background color of the category is dark.
   * @returns {?ReactElement<any>} for each index in {links}, a {TouchableOpacity} with the name of the link
   *                               or null if there are no links
   */
  _renderSectionLinks(links: Array < NamedLink >, isBackgroundDark: boolean): ?ReactElement < any > {
    if (links == null) {
      return null;
    }

    const textColor: string = (isBackgroundDark)
        ? Constants.Colors.primaryWhiteText
        : Constants.Colors.primaryBlackText;
    const iconColor: string = (isBackgroundDark)
        ? Constants.Colors.secondaryWhiteText
        : Constants.Colors.secondaryBlackText;

    // Get current language for translations
    const language: Language = this.props.language;
    const Translations: Object = TranslationUtils.getTranslations(language);

    return (
      <View>
        <Header
            icon={{name: 'insert-link', class: 'material'}}
            title={Translations.useful_links} />
        {links.map((link, index) => {
          const translatedLink: string = TranslationUtils.getTranslatedVariant(language, 'link', link)
              || Configuration.getDefaultLink();
          const translatedName: string = TranslationUtils.getTranslatedName(language, link)
              || translatedLink;

          return (
            <View key={translatedLink}>
              <TouchableOpacity
                  style={{flexDirection: 'row', alignItems: 'center'}}
                  onPress={() => this._openLink(translatedLink, Translations)}>
                {this._getLinkIcon(translatedLink, iconColor)}
                <View>
                  <Text style={[_styles.link, {color: textColor}]}>
                    {translatedName}
                  </Text>
                  {this._getFormattedLink(translatedLink, textColor)}
                </View>
              </TouchableOpacity>
              {(index < links.length - 1)
                ? <View style={[_styles.divider, {backgroundColor: textColor}]} />
                : null
              }
            </View>
          );
        })}
      </View>
    );
  }

  /**
   * Returns a list of touchable views which open links in the web browser.
   *
   * @param {Array<NamedLink>} links list of links to social media sites in the current category
   * @returns {?ReactElement<any>} for each index in links, a TouchableOpacity with an icon representing
   *                              the social media site, or null if there are no links
   */
  _renderSectionSocialMedia(links: ?Array < NamedLink >): ?ReactElement < any > {
    if (links == null) {
      return null;
    }

    // Get current language for translations
    const language: Language = this.props.language;
    const Translations: Object = TranslationUtils.getTranslations(language);

    return (
      <View style={_styles.socialMediaContainer}>
        {links.map((link: NamedLink) => {
          const url: string = TranslationUtils.getTranslatedVariant(language, 'link', link)
              || Configuration.getDefaultLink();
          const name: ?string = TranslationUtils.getTranslatedName(language, link);

          if (name == null) {
            return null;
          } else {
            return (
              <TouchableOpacity
                  key={url}
                  onPress={() => this._openLink(url, Translations)}>
                <Ionicons
                    color={DisplayUtils.getSocialMediaIconColor(name)}
                    name={DisplayUtils.getSocialMediaIconName(name)}
                    size={Constants.Sizes.Icons.Large}
                    style={_styles.socialMediaIcon} />
              </TouchableOpacity>
            );
          }
        })}
      </View>
    );
  }

  /**
   * Renders a set of views to display details about a link section.
   *
   * @param {string} id identifier of the section to render. If it is a subsection, ids are separated by dashes
   * @returns {ReactElement<any>} the set of views to render
   */
  _renderSection(id: string): ReactElement < any > {
    const ids: Array < string > = id.split('-');
    let categoryList: Array < LinkSection > = this.props.links;
    let depth: number = 0;

    let currentSection: ?LinkSection = null;
    let sectionImage: ?string = null;

    while (currentSection == null && categoryList != null && depth < ids.length) {
      for (let i = 0; i < categoryList.length; i++) {
        if (categoryList[i].id == ids[depth]) {
          if (depth == 0) {
            sectionImage = categoryList[i].image;
          }

          if (depth === ids.length - 1) {
            currentSection = categoryList[i];
          } else {
            categoryList = categoryList[i].categories;
            depth += 1;
          }
          break;
        }
      }
    }

    const section = currentSection;
    if (section == null) {
      // TODO: return generic error view?
      return (
        <View style={_styles.container} />
      );
    }

    if (sectionImage != null) {
      section.image = sectionImage;
    }

    let categoryBackgroundColor: string = Constants.Colors.primaryBackground;
    if (Constants.Colors[section.id] != null) {
      categoryBackgroundColor = Constants.Colors[section.id];
    }

    const isBackgroundDark: boolean = DisplayUtils.isColorDark(categoryBackgroundColor);

    return (
      <View style={[_styles.container, {backgroundColor: categoryBackgroundColor}]}>
        <ScrollView style={_styles.scrollview}>
          {this._renderSectionBanner(section)}
          {this._renderSectionSocialMedia(section.social)}
          {this._renderSectionCategories(section.categories, isBackgroundDark)}
          {this._renderSectionLinks(section.links, isBackgroundDark)}
        </ScrollView>
      </View>
    );
  }

  /**
   * Renders a view according to the current route of the navigator.
   *
   * @param {Route} route object with properties to identify the route to display.
   * @returns {ReactElement<any>} the view to render, based on {route}.
   */
  _renderScene(route: Route): ReactElement < any > {
    if (typeof (route.id) == 'string') {
      return this._renderSection(route.id);
    }

    switch (route.id) {
      case 0:
        return (
          <Menu
              language={this.props.language}
              sections={this.props.links}
              onSectionSelected={this._onCategorySelected.bind(this)} />
        );
      default:
        // TODO: return generic error view?
        return (
          <View style={_styles.container} />
        );
    }
  }

  /**
   * Renders each of the sections, with one of them focused and showing an image.
   *
   * @returns {ReactElement<any>} the hierarchy of views to render.
   */
  render(): ReactElement < any > {
    if (this.props.links == null || this.props.links.length === 0) {
      return (
        <View style={_styles.container} />
      );
    } else {
      return (
        <Navigator
            configureScene={this._configureScene}
            initialRoute={{id: 0}}
            ref='Navigator'
            renderScene={this._renderScene.bind(this)}
            style={_styles.container} />
      );
    }
  }
}

// Private styles for component
const _styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Constants.Colors.primaryBackground,
  },
  banner: {
    height: 175,
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
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
  bannerTextContainer: {
    backgroundColor: Constants.Colors.darkTransparentBackground,
  },
  bannerText: {
    marginTop: Constants.Sizes.Margins.Regular,
    marginBottom: Constants.Sizes.Margins.Regular,
    marginLeft: Constants.Sizes.Margins.Expanded,
    marginRight: Constants.Sizes.Margins.Expanded,
    color: Constants.Colors.primaryWhiteText,
    fontSize: Constants.Sizes.Text.Title,
  },
  socialMediaContainer: {
    backgroundColor: Constants.Colors.lightTransparentBackground,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  socialMediaIcon: {
    margin: Constants.Sizes.Margins.Regular,
  },
  scrollview: {
    flex: 1,
  },
  link: {
    margin: Constants.Sizes.Margins.Regular,
    fontSize: Constants.Sizes.Text.Body,
    width: screenWidth - TEXT_PADDING,
  },
  linkSubtitle: {
    marginLeft: Constants.Sizes.Margins.Regular,
    marginRight: Constants.Sizes.Margins.Regular,
    marginBottom: Constants.Sizes.Margins.Regular,
    fontSize: Constants.Sizes.Text.Caption,
  },
  linkIcon: {
    margin: Constants.Sizes.Margins.Regular,
    marginLeft: Constants.Sizes.Margins.Expanded,
  },
  divider: {
    flex: 1,
    height: StyleSheet.hairlineWidth,
  },
});

// Map state to props
const select = (store) => {
  return {
    language: store.config.language,
    links: store.discover.links,
  };
};

// Map dispatch to props
const actions = (dispatch) => {
  return {
    onSectionsLoaded: (links: Array < LinkSection >) => dispatch(setDiscoverLinks(links)),
  };
};

export default connect(select, actions)(Links);

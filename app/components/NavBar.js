/*
 * Navigation and search bar for the top of the app, to allow the user to search from anywhere.
 */
'use strict';

// React imports
const React = require('react-native');
const {
  Component,
  Dimensions,
  LayoutAnimation,
  Platform,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  View,
} = React;

const Constants = require('../Constants');
const Ionicons = require('react-native-vector-icons/Ionicons');
const MaterialIcons = require('react-native-vector-icons/MaterialIcons');
const Preferences = require('../util/Preferences');
const StatusBar = require('../util/StatusBar');

const {height, width} = Dimensions.get('window');

// Declaring icons depending on the platform
var Icon;
var backIcon;
if (Platform.OS === 'ios') {
  Icon = Ionicons;
  backIcon = 'ios-arrow-back';
} else {
  Icon = require('react-native-vector-icons/MaterialIcons');
  backIcon = 'arrow-back';
}

class SearchBar extends Component {

  /*
   * Properties which the parent component should make available to this component.
   */
  static propTypes = {
    onSearch: React.PropTypes.func.isRequired,
    onBack: React.PropTypes.func.isRequired,
  };

  /*
   * Pass props.
   */
  constructor(props) {
    super(props);
    this.state = {
      showBackButton: false,
    };
  };

  setState(state) {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    super.setState(state);
  }

  /*
   * Renders a text input field for searching.
   */
  render() {
    // Get current language for translations
    let Translations = null;
    if (Preferences.getSelectedLanguage() === 'en') {
      Translations = require('../util/Translations.en.js');
    } else {
      Translations = require('../util/Translations.fr.js');
    }

    // Setting position of search bar and back button dependent on if back button is showing.
    let searchBarLeft = (this.state.showBackButton)
        ? 50
        : 10;
    let searchBarWidth = (this.state.showBackButton)
        ? width - 60
        : width - 20;
    let backButtonLeft = (this.state.showBackButton)
        ? 0
        : -60;

    return (
      <View style={_styles.container}>
        <TouchableOpacity onPress={this.props.onBack} style={{height: 40, alignItems: 'center', left: backButtonLeft}}>
          <Icon name={backIcon} size={24} color={'white'} style={{marginLeft: 20, marginRight: 20, marginTop: 8}} />
        </TouchableOpacity>
        <View style={[_styles.innerContainer, {position: 'absolute', width: searchBarWidth, left: searchBarLeft, top: 0}]}>
          <Ionicons
              onPress={() => this.refs.SearchInput.focus()}
              name={'ios-search'}
              size={24}
              color={'white'}
              style={{marginLeft: 10, marginRight: 10}} />
          <TextInput
              ref='SearchInput'
              style={{flex: 1, height: 40, color: Constants.Colors.polarGrey}}
              onChangeText={(text) => this.props.onSearch(text)}
              autoCorrect={false}
              placeholder={Translations['search_placeholder']}
              placeholderTextColor={Constants.Colors.lightGrey} />
        </View>
      </View>
    )
  };
};

// Private styles for component
const _styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 60,
    marginTop: StatusBar.getStatusBarPadding(),
  },
  innerContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    borderRadius: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    margin: 10,
    marginLeft: 0,
  }
});

// Expose component to app
module.exports = SearchBar;

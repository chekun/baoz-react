'use strict';

var React = require('react-native');
var Clubs = require('../../Proxy/Clubs');
var ClubInfoView = require('../Clubs/ClubInfo');
var TopicListView = require('../Topics/TopicList');
var CommentListView = require('../Topics/CommentList');

var {
  Text,
  View,
  ListView,
  ActivityIndicatorIOS
  } = React;

var ClubView = React.createClass({
  getInitialState: function () {
    return {
      clubInfo: null,
      topicListInfo: new ListView.DataSource({
        rowHasChanged: (r1, r2) => r1 !== r2
      }),
      loaded: 0
    }
  },
  render: function () {
    if (this.state.loaded != 2) {
      return (
        <View style={Style.loadingContainer}>
          <ActivityIndicatorIOS color="#356DD0" style={{marginVertical: 30, marginBottom: 30}} />
        </View>
      );
    } else {
      return (
        <View style={Style.infoView}>
          <ClubInfoView
            data={this.state.clubInfo}/>
          <TopicListView
            refresh={this.refresh}
            nextPage={this.nextPage}
            selectTopic={this.selectTopic}
            data={this.state.topicListInfo}/>
        </View>
      )
    }
  },
  componentDidMount: function () {
    var that = this;
    Clubs.getClubsInfo(this.props.clubName, function (data) {
      that.setState({clubInfo: data, loaded: that.state.loaded + 1});
    }, function (err) {
      console.log(err.message);
    });
    Clubs.getClubsBBS(this.props.clubName, 0, function (data) {
      that.setState({topicListInfo: that.state.topicListInfo.cloneWithRows(data), loaded: that.state.loaded + 1});
    }, function (err) {
      console.log(err.message);
    })
  },
  selectTopic: function (id, title) {
    title = title.length > 10 ? title.substr(0, 10) + '...' : title;
    this.props.navigator.push({
      title: title,
      component: CommentListView,
      passProps: {topicId: id}
    });
  },
  nextPage: function (footerTopic) {
    var that = this;
    this.setState({loaded: 1});
    Clubs.getClubsBBS(this.state.clubInfo.id, footerTopic, function (data) {
      that.setState({
        topicListInfo: that.state.topicListInfo.cloneWithRows(data),
        loaded: that.state.loaded + 1
      });
    }, function (err) {
      console.log(err.message);
    })
  },
  refresh: function () {
    var that = this;
    this.setState({loaded: 1});
    Clubs.getClubsBBS(this.props.clubName, 0, function (data) {
      that.setState({
        topicListInfo: that.state.topicListInfo.cloneWithRows(data),
        loaded: that.state.loaded + 1
      });
    }, function (err) {
      console.log(err.message);
    })
  }
});


var Style = React.StyleSheet.create({
  loadingContainer: {
    backgroundColor: '#eeeeee',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  infoView: {
    top: 70,
    flex: 1
  }
});

module.exports = ClubView;
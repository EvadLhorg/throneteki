import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { toastr } from 'react-redux-toastr';

import News from '../Components/News/News';
import AlertPanel from '../Components/Site/AlertPanel';
import Panel from '../Components/Site/Panel';
import Typeahead from '../Components/Form/Typeahead';
import SideBar from '../Components/Lobby/SideBar';
import UserList from '../Components/Lobby/UserList';
import LobbyChat from '../Components/Lobby/LobbyChat';
import { getMessageWithLinks } from '../util';

import * as actions from '../actions';

class Lobby extends React.Component {
    constructor() {
        super();

        this.onChange = this.onChange.bind(this);
        this.onKeyPress = this.onKeyPress.bind(this);
        this.onSendClick = this.onSendClick.bind(this);
        this.onRemoveMessageClick = this.onRemoveMessageClick.bind(this);

        this.state = {
            message: ''
        };
    }

    componentDidMount() {
        this.props.loadNews({ limit: 3 });

        this.checkChatError(this.props);
    }

    componentWillReceiveProps(props) {
        this.checkChatError(props);
    }

    checkChatError(props) {
        if (props.lobbyError) {
            toastr.error('New users are limited from chatting in the lobby, try again later');

            setTimeout(() => {
                this.props.clearChatStatus();
            }, 5000);
        }
    }

    sendMessage() {
        if (this.state.message === '') {
            return;
        }

        this.props.socket.emit('lobbychat', this.state.message);

        this.setState({ message: '' });
    }

    onKeyPress(event) {
        if (event.key === 'Enter') {
            this.sendMessage();

            this.refs.message.clear();

            event.preventDefault();
        }
    }

    onSendClick(event) {
        event.preventDefault();

        this.sendMessage();
    }

    onChange(value) {
        this.setState({ message: value });
    }

    onRemoveMessageClick(messageId) {
        this.props.removeLobbyMessage(messageId);
    }

    render() {
        let isLoggedIn = !!this.props.user;
        let placeholder = isLoggedIn
            ? 'Enter a message...'
            : 'You must be logged in to send lobby chat messages';

        let newsStatus = null;

        if (this.props.newsLoading) {
            newsStatus = <div>News loading...</div>;
        } else if (!this.props.newsSuccess) {
            newsStatus = <div>Site news failed to load.</div>;
        }

        return (
            <div className='flex-container'>
                <SideBar>
                    <UserList users={this.props.users} />
                </SideBar>
                <div className='col-sm-offset-1 col-sm-10'>
                    <div className='main-header'>
                        <span className='text-center'>
                            <h1>A # LCG second edition</h1>
                        </span>
                    </div>
                </div>
                {this.props.motd && this.props.motd.message && (
                    <div className='col-sm-offset-1 col-sm-10 banner'>
                        <AlertPanel type={this.props.motd.motdType}>
                            {getMessageWithLinks(this.props.motd.message)}
                        </AlertPanel>
                    </div>
                )}
                {this.props.bannerNotice ? (
                    <div className='col-sm-offset-1 col-sm-10 announcement'>
                        <AlertPanel message={this.props.bannerNotice} type='error' />
                    </div>
                ) : null}
                <div className='col-sm-offset-1 col-sm-10'>
                    <Panel title='Latest site news'>
                        {newsStatus}
                        {this.props.newsSuccess && <News news={this.props.news} />}
                    </Panel>
                </div>
                <div className='col-sm-offset-1 col-sm-10 chat-container'>
                    <Panel title={`Lobby Chat (${this.props.users.length} online)`}>
                        <div>
                            <LobbyChat
                                messages={this.props.messages}
                                isModerator={
                                    this.props.user && this.props.user.permissions.canModerateChat
                                }
                                onRemoveMessageClick={this.onRemoveMessageClick}
                            />
                        </div>
                    </Panel>
                    <form
                        className='form form-hozitontal chat-box-container'
                        onSubmit={(event) => this.onSendClick(event)}
                    >
                        <div className='form-group'>
                            <div className='chat-box'>
                                <Typeahead
                                    disabled={!isLoggedIn}
                                    ref='message'
                                    value={this.state.message}
                                    placeholder={placeholder}
                                    labelKey={'name'}
                                    onKeyDown={this.onKeyPress}
                                    options={this.props.users}
                                    onInputChange={this.onChange}
                                    autoFocus
                                    dropup
                                    emptyLabel={''}
                                    minLength={2}
                                />
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        );
    }
}

Lobby.displayName = 'Lobby';
Lobby.propTypes = {
    bannerNotice: PropTypes.string,
    clearChatStatus: PropTypes.func,
    fetchNews: PropTypes.func,
    loadNews: PropTypes.func,
    loading: PropTypes.bool,
    lobbyError: PropTypes.string,
    messages: PropTypes.array,
    motd: PropTypes.object,
    news: PropTypes.array,
    newsLoading: PropTypes.bool,
    newsSuccess: PropTypes.bool,
    removeLobbyMessage: PropTypes.func,
    socket: PropTypes.object,
    user: PropTypes.object,
    users: PropTypes.array
};

function mapStateToProps(state) {
    return {
        bannerNotice: state.lobby.notice,
        loading: state.api.loading,
        lobbyError: state.lobby.lobbyError,
        messages: state.lobby.messages,
        motd: state.lobby.motd,
        news: state.news.news,
        newsLoading: state.api.REQUEST_NEWS && state.api.REQUEST_NEWS.loading,
        newsSuccess: state.api.REQUEST_NEWS && state.api.REQUEST_NEWS.success,
        socket: state.lobby.socket,
        user: state.account.user,
        users: state.lobby.users
    };
}

export default connect(mapStateToProps, actions, null)(Lobby);

import logger from './log.js';
import EventEmitter from 'events';
import jwt from 'jsonwebtoken';
import Sentry from '@sentry/node';
import User from './models/User.js';

class Socket extends EventEmitter {
    constructor(socket, options = {}) {
        super();

        this.socket = socket;
        this.user = socket.request.user && new User(socket.request.user);
        this.configService = options.configService;

        socket.on('error', this.onError.bind(this));
        socket.on('authenticate', this.onAuthenticate.bind(this));
        socket.on('disconnect', this.onDisconnect.bind(this));
    }

    get id() {
        return this.socket.id;
    }

    // Commands
    registerEvent(event, callback) {
        this.socket.on(event, this.onSocketEvent.bind(this, callback));
    }

    joinChannel(channelName) {
        this.socket.join(channelName);
    }

    leaveChannel(channelName) {
        this.socket.leave(channelName);
    }

    send(message, ...args) {
        this.socket.emit(message, ...args);
    }

    disconnect() {
        this.socket.disconnect();
    }

    // Events
    onSocketEvent(callback, ...args) {
        if (!this.user) {
            return;
        }

        try {
            callback(this, ...args);
        } catch (err) {
            logger.info(err);
            Sentry.configureScope((scope) => {
                scope.setExtra('extra', args);
            });
            Sentry.captureException(err);
        }
    }

    onAuthenticate(token) {
        jwt.verify(token, this.configService.getValue('secret'), (err, user) => {
            if (err) {
                return;
            }

            this.socket.request.user = user;

            this.emit('authenticate', this, user);
        });
    }

    onDisconnect(reason) {
        this.emit('disconnect', this, reason);
    }

    onError(err) {
        logger.info('Socket.IO error %s. Socket Id: %s', err, this.socket.id);
    }
}

export default Socket;

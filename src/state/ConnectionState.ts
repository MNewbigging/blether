import Peer from 'peerjs';

import {
  ExitMessage,
  ParticipantsMessage,
  PeerMessage,
  UserDataMessage,
  UserTextMessage,
} from '../model/PeerMessages';
import { SettingsData, User } from '../model/Settings';
import { TextMessage } from '../model/TextMessage';

export class ConnectionState {
  public readonly isHost: boolean;
  public readonly self: Peer;
  private incomingConnections: Peer.DataConnection[] = [];
  private outgoingConnections: Peer.DataConnection[] = [];
  private readonly userSettings: SettingsData;
  private announceUser?: User;

  constructor(userSettings: SettingsData, hostId?: string) {
    this.userSettings = userSettings;

    // If given a hostId to join, we're not the host
    this.isHost = hostId ? false : true;

    this.self = new Peer({
      config: {
        iceServers: [
          { urls: 'stun:stun.l.google.com:19302' },
          { urls: 'stun:global.stun.twilio.com:3478?transport=udp' },
        ],
      },
    });

    this.self.on('error', this.onPeerError);
    this.self.on('disconnected', this.onDisconnect);

    this.self.on('open', (id: string) => {
      this.onselfopen(id);

      // Connect to given host
      if (hostId) {
        this.outgoingConnection(hostId);
      }
    });

    this.self.on('connection', this.incomingConnection);
  }

  // Event callbacks to be set by ChatState
  public onselfopen = (id: string) => {};
  public onreceivedata = (message: PeerMessage) => console.log('data: ', message);

  public sendGroupMessage(message: PeerMessage) {
    this.outgoingConnections.forEach((conn) => conn.send(JSON.stringify(message)));
  }

  public announceNewParticipant(user: User) {
    // Only the host can do this
    if (!this.isHost) {
      return;
    }

    this.announceUser = user;

    // Check if outgoing connection made with this new user yet
    const exists = this.outgoingConnections.find((conn) => conn.peer === user.peerId);
    // If made, can announce new member now
    if (exists) {
      this.heraldNewParticipant();
    }
    // Otherwise, will be announced when outgoing connection is made
  }

  public disconnect() {
    console.log('disconnecting...');
    // Send a leaving message to everyone so they know to cleanup their connections to the leaver
    const msg = new ExitMessage({
      peerId: this.self.id,
      name: this.userSettings.name,
      icon: this.userSettings.icon,
    });
    this.sendGroupMessage(msg);

    //setTimeout(() => this.self.destroy(), 0);
  }

  public cleanupConnections(peerId: string) {
    this.incomingConnections = this.incomingConnections.filter((conn) => conn.peer !== peerId);
    this.outgoingConnections = this.outgoingConnections.filter((conn) => conn.peer !== peerId);
  }

  public outgoingConnection(id: string) {
    console.log('connecting to peer with id: ', id);

    const conn = this.self.connect(id);

    // Attempt to reconnect on failure
    // TODO - stop trying after so many attempts
    conn.peerConnection.onconnectionstatechange = (_e: Event) => {
      if (conn.peerConnection.connectionState === 'failed') {
        this.outgoingConnection(id);
        return;
      }
    };

    conn.on('open', () => {
      console.log(this.self.id + ' opened outgoing connection to ' + conn.peer);
      this.outgoingConnections.push(conn);

      // On opening a new outgoing connection, send them own user data
      const user: User = {
        peerId: this.self.id,
        name: this.userSettings.name,
        icon: this.userSettings.icon,
      };
      const msg = new UserDataMessage(user);
      conn.send(JSON.stringify(msg));

      // If host
      if (this.isHost) {
        // Now update all participants with new open connection
        this.updateParticipants(conn.peer);
        this.heraldNewParticipant();
      }
    });
  }

  private readonly incomingConnection = (conn: Peer.DataConnection) => {
    conn.on('open', () => {
      //console.log(this.self.id + ' received conn: ', conn);
      this.incomingConnections.push(conn);
      conn.on('data', (data: any) => this.onreceivedata(JSON.parse(data)));

      // If we're the host,
      if (this.isHost) {
        // establish a return connection to joiner
        this.outgoingConnection(conn.peer);
      }
    });
  };

  private updateParticipants(newId: string) {
    // If there's only 1 other member so far, nobody else to update
    if (this.incomingConnections.length < 2) {
      return;
    }

    // New member needs to know about everyone other than host and themself
    const otherMembers = this.incomingConnections
      .filter((conn) => conn.peer !== newId)
      .map((conn) => conn.peer);
    const newPartyMsg = new ParticipantsMessage(otherMembers);
    console.log('new party msg: ', newPartyMsg);
    this.sendWhisper(newId, newPartyMsg);

    // Everyone else just needs to know about new member
    const groupPartyMsg = new ParticipantsMessage([newId]);
    otherMembers.forEach((id) => this.sendWhisper(id, groupPartyMsg));
  }

  private heraldNewParticipant() {
    if (!this.announceUser) {
      return;
    }

    // Send a message to everyone as if from joiner
    const message: TextMessage = {
      content: ' has joined',
      time: JSON.stringify(Date.now()),
      name: this.announceUser.name,
      icon: this.announceUser.icon,
      locked: true,
    };
    const textMsg = new UserTextMessage(message);
    this.sendGroupMessage(textMsg);
    this.onreceivedata(textMsg);

    this.announceUser = undefined;
  }

  private sendWhisper(id: string, message: PeerMessage) {
    const conn = this.outgoingConnections.find((conn) => conn.peer === id);
    if (!conn) {
      console.log('no outgoing conn for ', id);
      return;
    }

    conn.send(JSON.stringify(message));
  }

  private readonly onPeerError = (error: any) => {
    // Just log it for now
    console.error('peerjs error: ', error);
  };

  private readonly onDisconnect = () => {
    // Means self has disconnected from others
    // TODO - test this is true!
    console.warn('disconnected from other peers');
  };
}

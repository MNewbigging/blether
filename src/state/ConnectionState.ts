import Peer from 'peerjs';

import { PeerMessage, UserDataMessage } from '../model/PeerMessages';
import { SettingsData, User } from '../model/Settings';

export class ConnectionState {
  public readonly isHost: boolean;
  public readonly self: Peer;
  private incomingConnections: Peer.DataConnection[] = [];
  private outgoingConnections: Peer.DataConnection[] = [];
  private readonly userSettings: SettingsData;

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

  private readonly incomingConnection = (conn: Peer.DataConnection) => {
    conn.on('open', () => {
      console.log(this.self.id + ' received conn: ', conn);
      this.incomingConnections.push(conn);
      conn.on('data', (data: any) => this.onreceivedata(JSON.parse(data)));

      // If we're the host, establish a return connection to joiner
      if (this.isHost) {
        this.outgoingConnection(conn.peer);
      }
    });
  };

  private outgoingConnection(id: string) {
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
        name: this.userSettings.name,
        icon: this.userSettings.icon,
      };
      const msg = new UserDataMessage(user);
      conn.send(JSON.stringify(msg));
    });
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

/**
 * Joiner connects to host via invite id
 *  - on connection open, joiner sends name
 *  - on host conn open, send joiner host name
 *  - then host sends all other participants to connect to
 *
 * So on each open connection, both parties exchange names
 *
 * When host receives a new connection, he sends all members ids of all members
 * Each member receives the list and connects to any new members
 *
 * But what if two peers that don't know each other try to connect to each other
 * - does that make two separate connections between the same peers?
 * - and therefore double the name exchange?
 * ^
 * Each connection has a peer prop with the id of the peer at the other end of conn
 * On receiving a new connection, if that conn.peer already exists in conn list, ignore
 *
 * ^ OR:
 * Instead of having a single, 2-way connection between 2 peers
 * Have two 1-way connections:
 * Each member makes an outgoing connection
 * When opened, they save the connection and use it to send data
 */

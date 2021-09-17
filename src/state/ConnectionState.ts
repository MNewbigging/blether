import Peer from 'peerjs';

import { BletherSettings } from '../model/Settings';

export class ConnectionState {
  public readonly self: Peer;
  private others: Peer.DataConnection[] = [];

  constructor(hostId?: string) {
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

    this.self.on('open', (_id: string) => {
      if (hostId) {
        this.outgoingConnection(hostId);
      }
    });

    this.self.on('connection', this.incomingConnection);
  }

  public onreceivedata = () => {};

  private readonly incomingConnection = (conn: Peer.DataConnection) => {
    conn.on('open', () => {
      this.others.push(conn);
      console.log('added new peer - all peers: ', this.others);

      conn.on('data', (data: any) => this.onreceivedata());
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

    this.incomingConnection(conn);
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

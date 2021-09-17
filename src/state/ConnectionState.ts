import Peer from 'peerjs';

import { PeerMessage } from '../model/PeerMessages';

export class ConnectionState {
  public readonly isHost: boolean;
  public readonly self: Peer;
  private others: Peer.DataConnection[] = [];

  constructor(hostId?: string) {
    this.isHost = hostId ? true : false;

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

      if (hostId) {
        this.outgoingConnection(hostId);
      }
    });

    this.self.on('connection', this.incomingConnection);
  }

  // Event callbacks to be set by ChatState
  public onselfopen = (id: string) => {};
  public onconnection = () => {};
  public onreceivedata = (message: PeerMessage) => console.log('data: ', message);

  public sendGroupMessage(message: PeerMessage) {
    // stringify the message, send to all other connections
  }

  private readonly incomingConnection = (conn: Peer.DataConnection) => {
    conn.on('open', () => {
      this.setupConnection(conn);
      this.onconnection();
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
      this.setupConnection(conn);
    });
  }

  private setupConnection(conn: Peer.DataConnection) {
    // Save the connection
    this.others.push(conn);
    console.log('added new peer - all peers: ', this.others);

    // Setup callback for receiving data
    conn.on('data', (data: any) => this.onreceivedata(JSON.parse(data)));
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

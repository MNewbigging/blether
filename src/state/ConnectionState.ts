import Peer from 'peerjs';

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

    this.self.on('error', (err: any) => console.log('peer error: ', err));

    this.self.on('open', (id: string) => {
      console.log('self open, id: ', id);

      // If given a host id, connect with it
      if (hostId) {
        this.connectToPeer(hostId);
      }
    });

    this.self.on('connection', this.addNewPeer);
  }

  private readonly addNewPeer = (conn: Peer.DataConnection) => {
    conn.on('open', () => {
      //conn.send('hi there');
      console.log('opened connection to conn: ', conn);

      this.others.push(conn);
      console.log('added new peer - all peers: ', this.others);
    });
  };

  private connectToPeer(id: string) {
    console.log('connecting to peer with id: ', id);

    const conn = this.self.connect(id);

    // Handle inevitable first failure
    conn.peerConnection.onconnectionstatechange = (_e: Event) => {
      if (conn.peerConnection.connectionState === 'failed') {
        this.connectToPeer(id);
        return;
      }
    };

    this.addNewPeer(conn);
  }
}

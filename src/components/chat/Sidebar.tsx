import { observer } from 'mobx-react';
import React from 'react';

import { ChatState } from '../../state/ChatState';
import { Button } from '../common/buttons/Button';
import { IconName } from '../../model/Settings';
import { Icon } from '../common/icon/Icon';

import './sidebar.scss';
import '../common/blether-variables.scss';

interface Props {
  chatState: ChatState;
  onExit: () => void;
}

@observer
export class Sidebar extends React.Component<Props> {
  public render() {
    const { chatState, onExit } = this.props;

    const theme = chatState.userSettings.theme;
    const open = chatState.sidebarOpen ? 'open' : 'closed';
    const sidebarClasses = ['sidebar', 'secondary-ui', theme, open];

    const exitBtn = chatState.sidebarOpen ? undefined : IconName.DOOR;
    const inviteBtn = chatState.sidebarOpen ? undefined : IconName.EXPORT;
    const toggleBtn = chatState.sidebarOpen ? undefined : IconName.LARGER;

    const canInvite = chatState.canInvite;

    return (
      <div className={sidebarClasses.join(' ')}>
        <div className={'top-section'}>
          <Button
            text={'exit'}
            className={'exit-button'}
            onClick={() => {
              // Perform peer cleanup before leaving page
              chatState.exitChat();
              onExit();
            }}
            icon={exitBtn}
          />

          {canInvite && (
            <Button
              text={'invite'}
              className={'invite-button'}
              onClick={() => chatState.invite()}
              icon={inviteBtn}
            />
          )}
        </div>

        <div className={'mid-section ' + theme}>{this.renderParticipants()}</div>

        <div className={'bot-section'}>
          <Button
            text={'hide'}
            className={'hide-button'}
            onClick={() => chatState.toggleSidebar()}
            icon={toggleBtn}
          />
        </div>
      </div>
    );
  }

  private renderParticipants() {
    const { chatState } = this.props;

    return chatState.participants.map((user) => (
      <div className={'participant'}>
        <Icon name={user.icon} />
        {chatState.sidebarOpen && <div className={'name'}>{user.name}</div>}
      </div>
    ));
  }
}

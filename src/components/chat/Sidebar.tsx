import { observer } from 'mobx-react';
import React from 'react';

import { ChatState } from '../../state/ChatState';
import { Button } from '../common/buttons/Button';

import './sidebar.scss';
import '../common/blether-variables.scss';

import { IconName } from '../../model/Settings';
import { Icon } from '../common/icon/Icon';

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

    return (
      <div className={sidebarClasses.join(' ')}>
        <div className={'top-section'}>
          <Button text={'exit'} className={'exit-button'} onClick={() => onExit()} icon={exitBtn} />

          <Button text={'invite'} className={'invite-button'} onClick={() => {}} icon={inviteBtn} />
        </div>

        <div className={'mid-section'}>{this.renderParticipants()}</div>

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

    // Self appears at top
    // Only show icon if sidebar closed

    return (
      <div className={'participant'}>
        <Icon name={chatState.userSettings.icon} interactive={false} />
        {chatState.sidebarOpen && <div className={'name'}>{chatState.userSettings.name}</div>}
      </div>
    );
  }
}

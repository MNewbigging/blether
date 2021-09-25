import { action, observable } from 'mobx';

export enum ToastStatus {
  ENTER = 'enter',
  EXIT = 'exit',
  HIDDEN = 'hidden',
}

export class ToastState {
  @observable public toastStatus = ToastStatus.HIDDEN;
  @observable public toastMessage = '';

  private readonly toastDuration = 3000;

  @action public showInviteCopiedToast() {
    this.toastMessage = 'Invite link copied to clipboard!';
    this.toastStatus = ToastStatus.ENTER;

    setTimeout(this.exitToast, this.toastDuration);
  }

  public hideToast = () => {
    // Called on anim end, so check we're in exit status
    if (this.toastStatus === ToastStatus.EXIT) {
      this.toastStatus = ToastStatus.HIDDEN;
    }
  };

  private exitToast = () => {
    this.toastStatus = ToastStatus.EXIT;
  };
}

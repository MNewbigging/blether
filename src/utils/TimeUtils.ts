export class TimeUtils {
  public static formatTimeString(timeStr: string) {
    const hours = this.getTimeHours(timeStr);
    const mins = this.getTimeMins(timeStr);

    return hours + ':' + mins;
  }

  public static getTimeHours(timeStr: string) {
    const time = new Date(JSON.parse(timeStr));
    return this.validateTimeString(time.getHours().toString());
  }

  public static getTimeMins(timeStr: string) {
    const time = new Date(JSON.parse(timeStr));
    return this.validateTimeString(time.getMinutes().toString());
  }

  public static validateTimeString(timeStr: string) {
    // If it has length of 2, it's fine
    if (timeStr.length === 2) {
      return timeStr;
    }

    // Otherwise add 0 at start
    return '0' + timeStr;
  }
}

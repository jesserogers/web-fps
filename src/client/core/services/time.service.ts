export class DTime {

  public static time: int

  public static deltaTime: float

  public static fixedDeltaTime: float

  private static _delta: int

  public static setFixedDeltaTime(fixedDeltaTime: float): void {
    this.fixedDeltaTime = Math.max(fixedDeltaTime, 1 / 60)
  }

  public static getFixedDeltaMs(): int {
    return DTime.fixedDeltaTime * 1000
  }

  public static getDelta(): int {
    return Math.min(DTime._delta, 100)
  }

  public static setDelta(delta: int): void {
    this._delta = Math.min(delta, 100)
  }

}
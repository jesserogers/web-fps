export class DTime {

  public static time: int

  public static deltaTime: float

  public static fixedDeltaTime: float

  public static getFixedDeltaMs(): int {
    return 1000 * DTime.fixedDeltaTime
  }

  public static setFixedDeltaTime(fixedDeltaTime: float): void {
    DTime.fixedDeltaTime = Math.max(fixedDeltaTime, 1 / 60)
  }

  public static setDeltaTime(deltaTime: float): void {
    DTime.deltaTime = Math.min(deltaTime, 0.1)
  }

}
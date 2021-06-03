type IdFactory = Generator<int, int, int>

// we play Apex, we love RNG
export class Randomizer {

  // singleton instance
  private static _generator: IdFactory

  private static *idFactory(): IdFactory {
    let _init: number = 1
    while (true) {
      yield _init++
    }
  }

  // returns singleton instance
  private static getFactory(): IdFactory {
    if (!Randomizer._generator) {
      Randomizer._generator = Randomizer.idFactory()
    }
    return Randomizer._generator
  }

  // returns number ID
  public static generateNumericId(): number {
    return Randomizer.getFactory().next().value as number
  }

  // returns hex string ID
  public static generateId(): string {
    return Randomizer.generateNumericId().toString(16)
  }

  // returns random number within range
  public static randomNumber(_min: number, _max: number) {
    return Math.floor(Math.random() * Math.floor(_max + 1)) || _min
  }

}

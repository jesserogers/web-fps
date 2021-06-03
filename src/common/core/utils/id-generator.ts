export class IdGenerator {
  // singleton instance
  private _generator: IdFactory

  private *idFactory(): IdFactory {
    let _init: number = 1
    while (true) {
      yield _init++
    }
  }

  // returns singleton instance
  private getFactory(): IdFactory {
    if (!this._generator) {
      this._generator = this.idFactory()
    }
    return this._generator
  }

  // returns number ID
  public generateId(): number {
    return this.getFactory().next().value as number
  }

  // returns hex string ID
  public generateHexId(): string {
    return this.generateId().toString(16)
  }
}
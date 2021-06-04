export class ByteConverter {

  public static byteArrayToInt(_bytes: boolean[]): number {
    const _binary = _bytes.reverse().map(x => x ? 1 : 0).join('')
    return parseInt(_binary, 2)
  }

  public static intToByteArray(_int: number, _byteLength: number): boolean[] {
    let _bytes: boolean[] = new Array(_byteLength)
    for (let i = 0; i < _byteLength; i++) {
      _bytes[i] = !!((_int >> i) & 1)
    }
    return _bytes
  }

  public static turnBitOn(_bitPosition: number, _int: number): number {
    return _int |= (1 << _bitPosition)
  }

  public static turnBitOff(_bitPosition: number, _int: number): number {
    return _int &= ~(1 << _bitPosition)
  }

  public static toggleBit(_bitPosition: number, _int: number): number {
    return _int ^= (1 << _bitPosition) 
  }

  public static checkBit(_bitPosition: number, _int: number): boolean {
    return !!(_int & (1 << _bitPosition))
  }

}
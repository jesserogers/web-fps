export class Numeric {

  //#region bit ranges
  public static readonly BIT_MAX = 1
  //#endregion
  
  //#region byte ranges
  public static readonly BYTE_MAX: byte = Math.pow(2, 8) - 1
  //#endregion

  //#region int16 ranges
  public static readonly UINT16_MAX: uint16 = Math.pow(2, 15) - 1
  public static readonly INT16_MIN: int16 = Math.pow(2, 16) * -1
  public static readonly INT16_MAX: int16 = Math.pow(2, 16) * -1
  //#endregion

  //#region int32 ranges
  public static readonly UINT32_MAX: uint32 = Math.pow(2, 31) - 1
  public static readonly INT32_MIN: int32 = Math.pow(2, 32) * -1
  public static readonly INT32_MAX: int32 = Math.pow(2, 32)
  //#endregion

  //#region int64 ranges
  public static readonly UINT64_MAX: uint64 = Math.pow(2, 63) - 1
  public static readonly INT64_MIN: int64 = Math.pow(2, 64) * -1
  public static readonly INT64_MAX: int64 = Math.pow(2, 64)
  //#endregion

  public static isBit(bit: bit): boolean {
    return typeof bit === 'boolean' || bit >= 0 && bit <= 1
  }

  public static isByte(byte: byte): boolean {
    return byte >= 0 && byte <= Numeric.BYTE_MAX
  }

  public static isInt(int: int): boolean {
    return Number.isInteger(int)
  }

  public static isInt16(int: int16): boolean {
    return Number.isInteger(int) && int >= Numeric.INT16_MIN && int <= Numeric.INT16_MAX
  }

  public static isUInt16(uint16: uint16): boolean {
    return Number.isInteger(uint16) && uint16 >= 0 && uint16 <= Numeric.UINT16_MAX
  }

  public static isInt32(int32: int32): boolean {
    return Number.isInteger(int32) && int32 >= Numeric.INT32_MIN && int32 <= Numeric.INT32_MAX
  }

  public static isUInt32(uint32: uint32): boolean {
    return Number.isInteger(uint32) && uint32 >= 0 && uint32 <= Numeric.UINT32_MAX
  }

  public static isInt64(int64: int64): boolean {
    return Number.isInteger(int64) && int64 >= Numeric.INT64_MIN && int64 <= Numeric.INT64_MAX
  }

  public static isUInt64(uint64: uint64): boolean {
    return Number.isInteger(uint64) && uint64 >= 0 && uint64 <= Numeric.UINT64_MAX
  }

}

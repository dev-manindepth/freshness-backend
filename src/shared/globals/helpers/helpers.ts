export class Helper {
  static generateRandomIntegers(integerLength: number): number {
    const min = Math.pow(10, integerLength - 1);
    const max = Math.pow(10, integerLength) - 1;
    const randomInteger = Math.floor(Math.random() * (max - min + 1)) + min;

    return randomInteger;
  }
  static stringifyObject = (data: Record<string, any>): Record<string, string> => {
    const result: Record<string, string> = {};

    for (const [key, value] of Object.entries(data)) {
      if (typeof value !== 'object') {
        if (typeof value == 'string') {
          result[key] = value;
        } else {
          result[key] = `${value}`;
        }
      } else if (typeof value === 'object') {
        result[key] = JSON.stringify(value);
      }
    }

    return result;
  };
  static parseJSON(data:string):any{
    try{
      return JSON.parse(data);
    }catch(err){
      return data;
    }
  }
}

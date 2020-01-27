export class GenUtil {
  public static stringGen(): string {
    return Math.random()
      .toString(36)
      .substring(7);
  }

  public static randIntInRange(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min)) + min;
  }

  public static listGen<T>(length: number, genFunc: (any?) => T): T[] {
    const arr: T[] = [];
    for (let i = 0; i < length; i++) {
      arr.push(genFunc());
    }
    return arr;
  }

  public static pickDistinct<T>(pick: number, list: T[]): T[] {
    function execute(max: number, remaining: T[], acc: T[]): T[] {
      if (max === 0) {
        return acc;
      } else {
        const randInd = GenUtil.randIntInRange(0, remaining.length);
        const randElem = remaining[randInd];

        // stupid javascript
        acc.push(randElem);
        max -= 1;
        remaining.splice(randInd, 1);
        return execute(max, remaining, acc);
      }
    }

    const copyList = [];
    list.forEach(e => copyList.push(e));

    return execute(pick, copyList, []);
  }
}

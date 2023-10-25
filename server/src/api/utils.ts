export const shuffleArray = (array: any[]) => {
  for (let i = array.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
};

type CycleNextItemsArgs<T> = {
  array: T[];
  currentIndex?: number;
  currentValue?: T;
} & ({ currentIndex: number } | { currentValue: T });

export const cycleNextItem = <T>(args: CycleNextItemsArgs<T>) => {
  const index =
    args.currentIndex ??
    args.array.findIndex((item) => item === args.currentValue);

  const nextItem = args.array[(index + 1) % args.array.length];

  return nextItem;
};

export const cyclicRangeNumber = (incrementor: number, maxNumber: number) => {
  return ((incrementor % maxNumber) + maxNumber) % maxNumber;
};

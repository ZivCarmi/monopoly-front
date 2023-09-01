export const shuffleArray = (array: any[]) => {
  for (let i = array.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
};

export const cycleNextItem = (currentIndex: number | string, array: any[]) => {
  if (typeof currentIndex === "string") {
    currentIndex = array.indexOf(currentIndex);
  }

  const nextItem = array[++currentIndex % array.length];

  return nextItem;
};

export const cyclicRangeNumber = (incrementor: number, maxNumber: number) => {
  return ((incrementor % maxNumber) + maxNumber) % maxNumber;
};

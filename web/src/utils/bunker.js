export const countConsumption = (bunker) => {
  if (bunker.numberOfUsers === 0) {
    return 0;
  }
  return bunker.numberOfUsers * 1;
};

export const getTimeToZero = (bunker) => bunker.oxygen / countConsumption(bunker);

export const getTimeToFull = (bunker) => (bunker.oxygenCap - bunker.oxygen) / (bunker.oxygenGeneration - countConsumption(bunker));

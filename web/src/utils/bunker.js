export const countConsumption = (bunker) => {
    if (bunker.numberOfUsers === 0) {
        return 0;
    }
    return bunker.numberOfUsers * 0.1;
}

export const getTimeToZero = (bunker) => {
    return bunker.oxygen / countConsumption(bunker);
}

export const getTimeToFull = (bunker) => {
    return (bunker.oxygenCap - bunker.oxygen) / (bunker.oxygenGeneration - countConsumption(bunker));
}
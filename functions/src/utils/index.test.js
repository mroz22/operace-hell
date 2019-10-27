const { getRadiationForEpoch } = require('./index');

describe('utils', () => {
    describe('getRadiationForEpoch', () => {
        it('works', () => {
            expect(getRadiationForEpoch(1)).toBeDefined();
            expect(getRadiationForEpoch(0)).toEqual(0);
        })
    })
})
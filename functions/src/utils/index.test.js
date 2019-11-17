const { 
    getRadiationForEpoch,
    getRadiationForEpochAdvanced,
    getRandomInt,
    getNextMutation,
} = require('./index');

const game = {
    RADIATION: {
        0: 10,
        10: 20,
        20: 0,
        30: 0,
        40: 10,
    },
    RADIATION_PER_MUTATION: 10,
    MAX_SAFE_RADIATION: 100,
    MUTATIONS: [{
        id: 'a',
        name: 'aaa',
        descrition: 'aaaaaaa',
    }, {
        id: 'b',
        name: 'bbb',
        descrition: 'bbbbbbb'
    }],
};

describe('utils', () => {
    describe('getRadiationForEpoch', () => {
        it('works', () => {
            expect(getRadiationForEpoch({ ...game, epoch: 0})).toEqual(10);
            expect(getRadiationForEpoch({ ...game, epoch: 2})).toEqual(10);
            expect(getRadiationForEpoch({ ...game, epoch: 12})).toEqual(20);
            expect(getRadiationForEpoch({ ...game, epoch: 20})).toEqual(0);
        })

    });

    describe('getRadiationForEpochAdvanced', () => {
        it ('wrrr', () => {
            expect(getRadiationForEpochAdvanced({ ...game, epoch: 0})).toEqual(10);
            expect(getRadiationForEpochAdvanced({ ...game, epoch: 5})).toEqual(15);
            expect(getRadiationForEpochAdvanced({ ...game, epoch: 10})).toEqual(20);
            expect(getRadiationForEpochAdvanced({ ...game, epoch: 15})).toEqual(10);
            expect(getRadiationForEpochAdvanced({ ...game, epoch: 25})).toEqual(0);
            expect(getRadiationForEpochAdvanced({ ...game, epoch: 150})).toEqual(0);
        });
    });

    describe('getRandomInt', () => {
        it('works of course', () => {
            expect(getRandomInt(0, 10)).toBeLessThanOrEqual(10);
            expect(getRandomInt(0, 10)).toBeGreaterThanOrEqual(0);
        });
    });

    describe('getNextMutation', () => {
        it('null', () => {
            expect(
                getNextMutation(game, {
                    status: { radiation: 0, mutations: []}
                })
            ).toEqual(null);
        });
        it('null', () => {
            expect(
                getNextMutation(game, {
                    status: { radiation: 1.6666, mutations: []}
                })
            ).toEqual(null);
        });
        it('null', () => {
            expect(
                getNextMutation(game, {
                    status: { radiation: 10, mutations: []}
                })
            ).toEqual(null);
        });
        
        it('random mutation', () => {
            expect(
                getNextMutation(game, {
                    status: { radiation: 111, mutations: []}
                })
            ).not.toEqual(null);
        });
        it('no more mutation until next step', () => {
            expect(
                getNextMutation(game, {
                    status: { radiation: 119, mutations: [{ id: 'a', name: 'aaa'}]}
                })
            ).toEqual(null);
        });
        it('random different mutation', () => {
            expect(
                getNextMutation(game, {
                    status: { radiation: 121, mutations: [{ id: 'a', name: 'aaa'}]}
                })
            ).toMatchObject({ id: 'b', name: 'bbb' });
        })
        it('all mutations gone -> null', () => {
            expect(
                getNextMutation(game, {
                    status: { radiation: 10000, mutations: [{ id: 'a', name: 'aaa'}, { id: 'b', name: 'bbb'}]}
                })
            ).toEqual(null);
        })
    })
})
'use strict';

const {builder: {lift, sync, ext}, plan} = require('funk');

const co = require('co');

const canHandle = value => value && (value.then || value.constructor.name === 'GeneratorFunction');
const handle = value => co(value);

plan.registerExt(canHandle, handle);

const act1 = (number, string) => Promise.resolve(`Promised ${number}, ${string}`);
const act2 = (number, string) => function* () {
    return `Generated ${number}, ${string}`;
};

const example = lift((number, string) => {
    const one = ext(act1)(number, string);
    const two = ext(act2)(number, string);

    return [one, two];
});

const examplePlan = plan.build(example);
plan.run(examplePlan, 10, 'asdf').then(console.log).catch(console.log);

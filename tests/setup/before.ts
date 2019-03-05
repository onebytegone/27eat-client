import * as chai from 'chai';

let strictEquals: any = require('@silvermine/chai-strictly-equal'),
    jsdom: any = require('jsdom-global');

chai.use(strictEquals);
jsdom(undefined, {}); // returns a function that could be called to clean up

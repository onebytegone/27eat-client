import * as lib from '../src/js/index';
import { expect } from 'chai';

describe('index', () => {
   it('should exist', () => {
      expect(lib).to.be.an('object');
   });
});

import { async, TestBed } from '@angular/core/testing';
import { OrderByPipe } from './order-by.pipe';

describe('Order by pipe', () => {
  let orderByPipe: OrderByPipe;
  beforeEach(async(() => {
    TestBed.configureTestingModule({ providers: [OrderByPipe] })
      .compileComponents()
      .then(() => {
        orderByPipe = TestBed.get(OrderByPipe);
      });
  }));

  const shallowObjects: Array<any> = [
    {
      fruit: 'banana',
      vegetable: 'tomato',
    },
    {
      fruit: 'apple',
      vegetable: 'cucumber',
    },
    {
      fruit: 'mango',
      vegetable: 'lettuce',
    },
  ];

  const deepObjects: Array<any> = [
    {
      fruits: {
        fruit1: 'kiwi',
        fruit2: 'banana',
      },
      vegetable: 'tomato',
    },
    {
      fruits: {
        fruit1: 'mango',
        fruit2: 'pineapple',
      },
      vegetable: 'lettuce',
    },
    {
      fruits: {
        fruit1: 'apple',
        fruit2: 'guava',
      },
      vegetable: 'cucumber',
    },
  ];

  describe('should sort strings correctly', () => {
    it('A -> Z', () => {
      expect(orderByPipe.transform(['banana', 'apple', 'mango'], [])).toEqual([
        'apple',
        'banana',
        'mango',
      ]);
      expect(orderByPipe.transform(['banana', 'apple', 'mango'], ['+'])).toEqual([
        'apple',
        'banana',
        'mango',
      ]);
    });

    it('Z -> A', () => {
      expect(orderByPipe.transform(['mango', 'banana', 'apple'], ['-'])).toEqual([
        'mango',
        'banana',
        'apple',
      ]);
    });
  });

  describe('should sort numbers correctly', () => {
    it('A -> Z', () => {
      expect(orderByPipe.transform([3, 1, 2], [])).toEqual([1, 2, 3]);
      expect(orderByPipe.transform([3, 1, 2], ['+'])).toEqual([1, 2, 3]);
    });

    it('Z -> A', () => {
      expect(orderByPipe.transform([3, 1, 2], ['-'])).toEqual([3, 2, 1]);
    });
  });

  describe('should sort flat objects correctly', () => {
    it('A -> Z', () => {
      expect(orderByPipe.transform(shallowObjects, ['fruit'])).toEqual([
        {
          fruit: 'apple',
          vegetable: 'cucumber',
        },
        { fruit: 'banana', vegetable: 'tomato' },
        { fruit: 'mango', vegetable: 'lettuce' },
      ]);
      expect(orderByPipe.transform(shallowObjects, ['+', 'vegetable'])).toEqual([
        {
          fruit: 'apple',
          vegetable: 'cucumber',
        },
        { fruit: 'mango', vegetable: 'lettuce' },
        { fruit: 'banana', vegetable: 'tomato' },
      ]);
    });

    it('Z -> A', () => {
      expect(orderByPipe.transform(shallowObjects, ['-', 'fruit'])).toEqual([
        {
          fruit: 'mango',
          vegetable: 'lettuce',
        },
        { fruit: 'banana', vegetable: 'tomato' },
        { fruit: 'apple', vegetable: 'cucumber' },
      ]);
    });
  });

  describe('should sort deep objects correctly', () => {
    it('A -> Z', () => {
      expect(orderByPipe.transform(deepObjects, ['fruits', 'fruit2'])).toEqual([
        {
          fruits: {
            fruit1: 'kiwi',
            fruit2: 'banana',
          },
          vegetable: 'tomato',
        },
        {
          fruits: {
            fruit1: 'apple',
            fruit2: 'guava',
          },
          vegetable: 'cucumber',
        },
        {
          fruits: {
            fruit1: 'mango',
            fruit2: 'pineapple',
          },
          vegetable: 'lettuce',
        },
      ]);
      expect(orderByPipe.transform(deepObjects, ['+', 'vegetable'])).toEqual([
        {
          fruits: {
            fruit1: 'apple',
            fruit2: 'guava',
          },
          vegetable: 'cucumber',
        },
        {
          fruits: {
            fruit1: 'mango',
            fruit2: 'pineapple',
          },
          vegetable: 'lettuce',
        },
        {
          fruits: {
            fruit1: 'kiwi',
            fruit2: 'banana',
          },
          vegetable: 'tomato',
        },
      ]);
    });

    it('Z -> A', () => {
      expect(orderByPipe.transform(deepObjects, ['-', 'fruits', 'fruit1'])).toEqual([
        {
          fruits: {
            fruit1: 'mango',
            fruit2: 'pineapple',
          },
          vegetable: 'lettuce',
        },
        {
          fruits: {
            fruit1: 'kiwi',
            fruit2: 'banana',
          },
          vegetable: 'tomato',
        },
        {
          fruits: {
            fruit1: 'apple',
            fruit2: 'guava',
          },
          vegetable: 'cucumber',
        },
      ]);
    });
  });
});

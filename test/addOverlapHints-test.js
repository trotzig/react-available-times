import addOverlapHints from '../src/addOverlapHints';

it('does not add overlap hints when no overlap exists', () => {
  const overlapped = addOverlapHints([
    {
      start: new Date(0),
      end: new Date(100),
    },
    {
      start: new Date(101),
      end: new Date(200),
    },
  ]);
  expect(overlapped.length).toEqual(2);
  expect(overlapped[0]).toEqual({
    start: new Date(0),
    end: new Date(100),
    overlaps: 0,
  });
  expect(overlapped[1].overlaps).toEqual(0);
});

it('adds overlap hints when overlaps exist', () => {
  const overlapped = addOverlapHints([
    {
      start: new Date(0),
      end: new Date(300),
    },
    {
      start: new Date(101),
      end: new Date(240),
    },
    {
      start: new Date(150),
      end: new Date(220),
    },
    {
      start: new Date(250),
      end: new Date(350),
    },
    {
      start: new Date(400),
      end: new Date(500),
    },
  ]);
  expect(overlapped.length).toEqual(5);
  expect(overlapped[0]).toEqual({
    start: new Date(0),
    end: new Date(300),
    overlaps: 3,
  });
  expect(overlapped[1]).toEqual({
    start: new Date(101),
    end: new Date(240),
    overlaps: 1,
  });
  expect(overlapped[2]).toEqual({
    start: new Date(150),
    end: new Date(220),
    overlaps: 2,
  });
  expect(overlapped[3]).toEqual({
    start: new Date(250),
    end: new Date(350),
    overlaps: 0,
  });
  expect(overlapped[4]).toEqual({
    start: new Date(400),
    end: new Date(500),
    overlaps: 0,
  });
});

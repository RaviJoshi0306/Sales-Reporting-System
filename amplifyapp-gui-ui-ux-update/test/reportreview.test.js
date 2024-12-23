let fetchedData = [{ company: { S: 'Zeta' } }, { company: { S: 'Alpha' } }];

const displayData = jest.fn();

const sortData = (column, order) => {
  let sortBy = column;
  let sortOrder = order;

  let sortedData = [...fetchedData];

  if (column === 'date') {
    sortedData.sort((a, b) => {
      let dateA = new Date(a.date.S);
      let dateB = new Date(b.date.S);
      return order === 'newest' ? dateB - dateA : dateA - dateB;
    });
  } else {
    sortedData.sort((a, b) => {
      let textA = a[column]?.S?.toLowerCase() || '';
      let textB = b[column]?.S?.toLowerCase() || '';
      return order === 'asc' ? textA.localeCompare(textB) : textB.localeCompare(textA);
    });
  }

  displayData(sortedData);
};

describe('sortData', () => {
  it('should sort alphabetically when column is not "date" (ascending)', () => {
    const mockData = [{ company: { S: 'Zeta' } }, { company: { S: 'Alpha' } }];

    fetchedData = mockData; // Use mock data for fetchedData

    // Clear previous calls
    displayData.mockClear();

    sortData('company', 'asc');

    expect(displayData).toHaveBeenCalled();
    expect(displayData.mock.calls[0][0]).toEqual([{ company: { S: 'Alpha' } }, { company: { S: 'Zeta' } }]);
  });

  it('should sort alphabetically when column is not "date" (descending)', () => {
    const mockData = [{ company: { S: 'Alpha' } }, { company: { S: 'Zeta' } }];

    fetchedData = mockData;

    displayData.mockClear();

    sortData('company', 'desc');

    expect(displayData).toHaveBeenCalled();
    expect(displayData.mock.calls[0][0]).toEqual([{ company: { S: 'Zeta' } }, { company: { S: 'Alpha' } }]);
  });
});

// Mock `document.getElementById`
document.getElementById = jest.fn().mockImplementation(() => {
  return { innerHTML: '' };
});

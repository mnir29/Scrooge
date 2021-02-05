// POST method to api for updating stock data
export const updateData = async (data) => {
  await fetch('api/data', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({data: data})
  });
};

// POST method to api for analyzing data within given dates
// Returns 
export const fetchAnalysis = async (start, end) => {
  const response = await fetch('api/data/analysis', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({start: start, end: end})
  });
  const res = await response.json();
  return res;
};
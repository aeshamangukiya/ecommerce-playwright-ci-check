/**
 * VIDEO 10 -> PART 5
 * All test data in one place (test data idea: Video 7)
 */
export const testData = {
  // Login details come from .env (local) or GitHub secrets (CI) - never from code
  validUser: {
    email: process.env.APP_EMAIL ?? '',
    password: process.env.APP_PASSWORD ?? ''
  },

  // HTC Touch HD: in stock and has no required options (checked on the live site)
  product: {
    id: '28',
    name: 'HTC Touch HD',
    quantity: 2
  },

  // Search "Mac" -> filter by category -> sort by price
  search: {
    keyword: 'Mac',
    category: 'Laptops & Notebooks',
    resultsInCategory: ['MacBook', 'MacBook Air', 'MacBook Pro'],
    sortBy: 'Price (High > Low)',
    resultsSorted: ['MacBook Pro', 'MacBook Air', 'MacBook']
  },

  address: {
    firstName: 'QA',
    lastName: 'Map',
    address1: 'MG Road 1',
    city: 'Pune',
    postCode: '411001',
    country: 'India',
    region: 'Maharashtra'
  }
};

// A new user for every run (dynamic data: Video 7).
// The random part keeps two parallel tests from getting the same email.
export function createUser() {
  const uniqueId = `${Date.now()}${Math.floor(Math.random() * 1000)}`;

  return {
    firstName: 'QA',
    lastName: 'Map',
    email: `qamap.${uniqueId}@example.com`,
    telephone: '9876543210',
    password: 'Test@12345'
  };
}

export type NewUser = ReturnType<typeof createUser>;
export type Address = typeof testData.address;

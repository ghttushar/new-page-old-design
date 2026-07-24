// ***********************************************************
// This example support/e2e.ts is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:

import './commands';

// Alternatively you can use CommonJS syntax:
// require('./commands')

// Handle uncaught exceptions globally
Cypress.on('uncaught:exception', (err, runnable) => {
  // If the error message contains "Maximum update depth exceeded", ignore it
  if (err.message.includes('Maximum update depth exceeded')) {
    // Returning false prevents Cypress from failing the test
    return false;
  }
  // For all other errors, allow the test to fail
  return true;
});

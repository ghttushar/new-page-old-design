/// <reference types="cypress" />
// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
//
// declare global {
//   namespace Cypress {
//     interface Chainable {
//       login(email: string, password: string): Chainable<void>
//       drag(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       dismiss(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       visit(originalFn: CommandOriginalFn, url: string, options: Partial<VisitOptions>): Chainable<Element>
//     }
//   }
// }

import { GlobalDataTestIds } from '../enums/global';

//login command
Cypress.Commands.add(
  'loginAndSelectAccount',
  (email: string, password: string, targetId: string) => {
    cy.visit('/user/login');
    cy.get('[data-test="login-email-input"]').type(email);
    cy.get('[data-test="login-password-input"]').type(password);
    cy.get('[data-test="login-button"]').click();

    // Intercept API call
    cy.intercept(
      'GET',
      'https://api.test.anarix.ai/api/auth/user-account-mapping/'
    ).as('getItems');

    cy.wait('@getItems').then(({ response }) => {
      if (!response || !response.body || !response.body.data) {
        throw new Error('API response is missing data');
      }

      // Extract accountId._id values
      const accountIds = response.body.data.map(
        (item: any) => item.accountId._id
      );

      if (accountIds.includes(targetId)) {
        cy.get(`[data-test="account-id-${targetId}"]`).click();
      } else {
        throw new Error(`Account ID ${targetId} not found in API response`);
      }
    });
    cy.intercept(
      'POST',
      'https://api.test.anarix.ai/api/advertising/v2/walmart/overall/table?pageSize=50&page=1&entityType=campaign'
    ).as('postData');
    cy.wait('@postData', { timeout: 20000 });
  }
);

//navigate to submenu command
Cypress.Commands.add('navigateToSubMenu', (menuKey, subMenuKey) => {
  cy.get(`[data-test=Top-menu-${menuKey}]`).click();
  cy.get(`[data-test=sub-menu-item-${subMenuKey}]`).click();
});

//check marketplace text command
Cypress.Commands.add('checkPageName', (pageNameText) => {
  cy.get('[data-test="page-name"] span') // Target the <span> inside the div
    .invoke('text') // Get the text content
    .should('eq', pageNameText); // Assert that it matches
});

//check marketplace text command
Cypress.Commands.add('checkMarketplace', (marketplaceText) => {
  cy.get(`[data-test=marketplace-header-${marketplaceText}]`).should('exist');
});

//check marketplace dropdown command
Cypress.Commands.add('checkMarketplaceDD', () => {
  cy.get('[data-test="marketplace-dropdown"]').should('exist');
});

//check profile command
Cypress.Commands.add('checkProfile', () => {
  cy.get('[data-test="profile-present"]').should('exist');
});

//check pagination command
Cypress.Commands.add('checkPagination', () => {
  cy.get('[data-test="custom-pagination"]').should('exist');
  cy.get('[data-test="page-size-dropdown"]').should('exist');
  cy.get('[data-test="pagination-controls"]').should('exist');
  cy.get('[data-test="previous-page-button"]').contains('<').should('exist');
  cy.get('[data-test="next-page-button"]').contains('>').should('exist');
});

Cypress.Commands.add('verifyTableColumns', (columnNames) => {
  cy.get('[data-test="custom-table-wrapper"]').should('exist');
  cy.get('[data-test="table-thead"]').should('exist');
  columnNames.forEach((column: string) => {
    cy.get('[data-test="table-th"]').contains(column).should('exist');
  });
  cy.get('[data-test="table-tbody"]').should('exist');
  cy.get('[data-test="table-row"]').should('have.length.greaterThan', 0);
});

Cypress.Commands.add('verifyTableHeaderColumns', (columnNames) => {
  cy.get('[data-test="custom-table-wrapper"]').should('exist');
  cy.get('[data-test="table-th"]').should('exist');
  columnNames.forEach((column: string) => {
    cy.get('[data-test="table-th"]').contains(column).should('exist');
  });
  cy.get('[data-test="table-tbody"]').should('exist');
  cy.get('[data-test="table-row"]').should('have.length.greaterThan', 0);
});

Cypress.Commands.add('saveSession', () => {
  const localStorageKeys = [
    'accountDetails',
    'accountID',
    'advertisingMarketplace',
    'authToken',
    'availableAccounts',
    'brandNameVariations',
    'chatbotMessages',
    'lastSelectedMarketplace',
    'mappedAccounts',
    'marketIntelligenceFilters',
    'paginationModel',
    'selectedAdvertisingAccount',
    'selectedUserAccountMapping',
    'selectedCatalogAccount',
  ];

  cy.window().then((win) => {
    localStorageKeys.forEach((key) => {
      const value = win.localStorage.getItem(key);
      if (value) Cypress.env(key, value);
    });
  });
});

Cypress.Commands.add('restoreSession', () => {
  const localStorageKeys = [
    'accountDetails',
    'accountID',
    'advertisingMarketplace',
    'authToken',
    'availableAccounts',
    'brandNameVariations',
    'chatbotMessages',
    'lastSelectedMarketplace',
    'mappedAccounts',
    'marketIntelligenceFilters',
    'paginationModel',
    'selectedAdvertisingAccount',
    'selectedUserAccountMapping',
    'selectedCatalogAccount',
  ];

  return cy.window().then((win) => {
    localStorageKeys.forEach((key) => {
      const value = Cypress.env(key);
      if (value) win.localStorage.setItem(key, value);
    });
    return cy.wrap(null);
  });
});

Cypress.Commands.add('selectMarketplace', (marketplaceName) => {
  cy.get(`[data-test=${GlobalDataTestIds.MARKETPLACE_DROPDOWN}]`).click();
  cy.get('li').contains(marketplaceName).click();
  cy.get(`[data-test=${GlobalDataTestIds.MARKETPLACE_DROPDOWN}]`).should(
    'contain',
    marketplaceName
  );
  cy.wait(2000);
});

import { GlobalDataTestIds } from '../enums/global';
import { KeywordTrackerDataTestIds } from '../enums/keyword-tracker';

// Test suite for the Keyword Tracker page

// Test for keyword tracker to check if the header elements are present
describe('Keyword Tracker', () => {
  beforeEach(() => {
    cy.loginAndSelectAccount(
      'anarix_qa@mailinator.com',
      'Napqueen@123',
      '6527f0a6be26660071c5dfac'
    );
    cy.wait(5000);
    cy.navigateToSubMenu('market-intelligence', 'keyword-tracker');
  });

  it('checks if the header elements are present', () => {
    cy.checkMarketplace('Marketplace');
    cy.checkMarketplaceDD();
    cy.checkProfile();
    cy.checkPageName('Keyword Tracker');

    cy.get(
      `[data-test=${KeywordTrackerDataTestIds.KEYWORD_TRACKER_TABS}]`
    ).should('be.visible');

    cy.get(`[data-test=${KeywordTrackerDataTestIds.KEYWORD_TRACKER_TABS}]`)
      .find('button')
      .then(($buttons) => {
        expect($buttons.eq(0)).to.contain.text('Active');
        expect($buttons.eq(1)).to.contain.text('Inactive');
      });

    cy.get(
      `[data-test=${KeywordTrackerDataTestIds.TABLE_BUTTON_CONTAINER}]`
    ).within(() => {
      cy.get('svg').should('exist');
      cy.get('input[placeholder="Search by Keyword"]').should('exist');
      cy.contains('button', 'Add Keyword').should('exist');
      cy.get('button').find('svg').should('exist');
    });
  });
});

// Test for custom table validation
describe('Custom Table Validation', () => {
  beforeEach(() => {
    cy.loginAndSelectAccount(
      'anarix_qa@mailinator.com',
      'Napqueen@123',
      '6527f0a6be26660071c5dfac'
    );
    cy.wait(5000);
    cy.navigateToSubMenu('market-intelligence', 'keyword-tracker');
  });

  it('should verify table structure and column headers', () => {
    cy.get(`[data-test=${GlobalDataTestIds.CUSTOM_TABLE_WRAPPER}]`).should(
      'be.visible'
    );
    cy.get(
      `[data-test=${GlobalDataTestIds.CUSTOM_TABLE_WRAPPER}] table`
    ).should('be.visible');

    const expectedHeaders = [
      'Keyword',
      'Added At',
      'Updated At',
      'Channels',
      'Status',
      'Action',
    ];

    cy.get(`[data-test=${GlobalDataTestIds.CUSTOM_TABLE_WRAPPER}] th`).each(
      ($el, index) => {
        cy.wrap($el).should('contain.text', expectedHeaders[index]);
      }
    );
  });

  it('should sort the table by clicking on sortable column headers', () => {
    cy.get(`[data-test=${GlobalDataTestIds.CUSTOM_TABLE_WRAPPER}] th`)
      .contains('Keyword')
      .click();
    cy.wait(500);
    cy.get(`[data-test=${GlobalDataTestIds.CUSTOM_TABLE_WRAPPER}] th`)
      .contains('Keyword')
      .click();

    cy.get(
      `[data-test=${GlobalDataTestIds.CUSTOM_TABLE_WRAPPER}] tbody tr`
    ).should('have.length.greaterThan', 0);
  });

  it('should verify data rows exist in the table', () => {
    cy.get(
      `[data-test=${GlobalDataTestIds.CUSTOM_TABLE_WRAPPER}] tbody tr`
    ).should('have.length.greaterThan', 0);
  });

  it('should validate action buttons exist for each row', () => {
    cy.get(
      `[data-test=${GlobalDataTestIds.CUSTOM_TABLE_WRAPPER}] tbody tr`
    ).each(($row) => {
      cy.wrap($row).find('td:last-child button').should('exist');
    });
  });
});

// Test for searching
describe('Searching', () => {
  beforeEach(() => {
    cy.loginAndSelectAccount(
      'anarix_qa@mailinator.com',
      'Napqueen@123',
      '6527f0a6be26660071c5dfac'
    );
    cy.wait(5000);
    cy.navigateToSubMenu('market-intelligence', 'keyword-tracker');
  });

  it('should search for a keyword, validate the results, and clear the search', () => {
    cy.intercept(
      'GET',
      'https://api.test.anarix.ai/api/market-intelligence/serp/keywords?marketplace=walmart&includeInactive=true'
    ).as('getKeywords');

    cy.wait('@getKeywords').then((interception) => {
      expect(interception.response?.statusCode).to.eq(200);
      const firstKeyword = interception.response?.body?.data[0].keyword;

      cy.get(
        `[data-test=${KeywordTrackerDataTestIds.TABLE_BUTTON_CONTAINER}]`
      ).within(() => {
        cy.get(`input[placeholder="Search by Keyword"]`)
          .should('exist')
          .as('searchInput');
      });

      cy.get('@searchInput').clear().type(firstKeyword);

      cy.get(
        `[data-test=${GlobalDataTestIds.CUSTOM_TABLE_WRAPPER}] tbody tr`
      ).each(($row) => {
        cy.wrap($row).find('td').first().should('contain.text', firstKeyword);
      });

      cy.wait(10000);

      cy.get('[data-test=kt-tableButtonContainer] h6')
        .contains('Clear')
        .should('be.visible')
        .click();

      cy.get('@searchInput').should('have.value', '');
    });
  });
});

// test for download button
describe('Download Button', () => {
  beforeEach(() => {
    cy.loginAndSelectAccount(
      'anarix_qa@mailinator.com',
      'Napqueen@123',
      '6527f0a6be26660071c5dfac'
    );
    cy.wait(5000);
    cy.navigateToSubMenu('market-intelligence', 'keyword-tracker');
  });

  it('should trigger a download and show a success toast message', () => {
    cy.get(`[data-test=${KeywordTrackerDataTestIds.TABLE_BUTTON_CONTAINER}]`)
      .find('button[aria-label="Download"]')
      .should('exist')
      .click();

    cy.get(`[data-test=${GlobalDataTestIds.TOAST_WRAPPER}]`)
      .should('exist')
      .find('span')
      .should('contain.text', 'Downloaded Successfully');
  });
});

//test for marketplace dropdown api
describe('Marketplace Dropdown API Test', () => {
  beforeEach(() => {
    cy.intercept(
      'GET',
      '**/api/market-intelligence/serp/keywords?marketplace=walmart&includeInactive=true'
    ).as('walmartAPI');
    cy.intercept(
      'GET',
      '**/api/market-intelligence/serp/keywords?marketplace=amazon&includeInactive=true'
    ).as('amazonAPI');

    cy.loginAndSelectAccount(
      'anarix_qa@mailinator.com',
      'Napqueen@123',
      '6527f0a6be26660071c5dfac'
    );
    cy.wait(5000);
    cy.navigateToSubMenu('market-intelligence', 'keyword-tracker');
  });

  it('should verify marketplace API changes when switching dropdown', () => {
    cy.wait('@walmartAPI').its('response.statusCode').should('eq', 200);

    cy.get(`[data-test=${GlobalDataTestIds.MARKETPLACE_DROPDOWN}]`).click();

    cy.get('ul[role="listbox"]').within(() => {
      cy.get('li[data-value="amazon"]').click();
    });

    cy.wait('@amazonAPI').its('response.statusCode').should('eq', 200);
  });
});

// test for toggle between active and inactive tabs
describe('Toggle Between Active and Inactive Tabs', () => {
  beforeEach(() => {
    cy.loginAndSelectAccount(
      'anarix_qa@mailinator.com',
      'Napqueen@123',
      '6527f0a6be26660071c5dfac'
    );
    cy.wait(5000);
    cy.navigateToSubMenu('market-intelligence', 'keyword-tracker');
  });

  it('should toggle between Active and Inactive tabs', () => {
    cy.get('[role="tab"]').contains('Inactive').click();
    cy.get('[role="tab"][aria-selected="true"]').should('contain', 'Inactive');
    cy.wait(5000);
    cy.get('[role="tab"]').contains('Active').click();
    cy.get('[role="tab"][aria-selected="true"]').should('contain', 'Active');
  });
});

// test for add keyword dialog
describe.only('Add Keywords Process', () => {
  beforeEach(() => {
    cy.loginAndSelectAccount(
      'anarix_qa@mailinator.com',
      'Napqueen@123',
      '6527f0a6be26660071c5dfac'
    );
    cy.wait(5000);
    cy.navigateToSubMenu('market-intelligence', 'keyword-tracker');
    cy.get(`[data-test=${KeywordTrackerDataTestIds.TABLE_BUTTON_CONTAINER}]`)
      .find('.MuiButtonBase-root.MuiButton-root.MuiButton-contained')
      .click();
  });

  it('should open the add keyword dialog', () => {
    cy.get(
      `[data-test=${KeywordTrackerDataTestIds.ADD_KEYWORD_DIALOG}]`
    ).should('be.visible');
    cy.wait(5000);
  });

  it('should select a marketplace', () => {
    cy.get(
      `[data-test=${KeywordTrackerDataTestIds.ADD_KEYWORD_DIALOG}]`
    ).should('be.visible');
    cy.get(
      `[data-test=${GlobalDataTestIds.MULTI_SELECT_DROPDOWN}] .MuiSelect-select`
    ).click();
    cy.get('[role="listbox"]').should('be.visible');
    cy.get('[role="listbox"] li').first().click();
    cy.get(
      `[data-test=${GlobalDataTestIds.MULTI_SELECT_DROPDOWN}] .MuiSelect-select`
    ).should('not.have.text', 'Amazon');
    cy.get('[role="listbox"] li').first().click();
  });

  it('should enter keywords, verify chips, and delete a keyword', () => {
    cy.get(
      `[data-test=${KeywordTrackerDataTestIds.ADD_KEYWORD_DIALOG}]`
    ).should('be.visible');

    cy.get(
      `[data-test=${KeywordTrackerDataTestIds.ENTER_KEYWORDS_INPUT}] input[type="text"]`
    )
      .should('be.visible')
      .click()
      .type('keyword1{enter}');

    cy.get(
      `[data-test=${KeywordTrackerDataTestIds.ENTER_KEYWORDS_INPUT}] input[type="text"]`
    ).type('keyword2{enter}');

    cy.get(
      `[data-test=${KeywordTrackerDataTestIds.ENTER_KEYWORDS_INPUT}]`
    ).within(() => {
      cy.get('.MuiChip-label').should('contain.text', 'keyword1');
      cy.get('.MuiChip-label').should('contain.text', 'keyword2');
    });

    cy.get('.MuiChip-label')
      .contains('keyword1')
      .parent()
      .find('[data-testid="CancelIcon"]')
      .click();

    cy.get(
      `[data-test=${KeywordTrackerDataTestIds.ENTER_KEYWORDS_INPUT}]`
    ).should('not.contain.text', 'keyword1');

    cy.get('.MuiChip-label').should('contain.text', 'keyword2');

    cy.get(`[data-test=${KeywordTrackerDataTestIds.ADD_KEYWORD_DIALOG}] button`)
      .should('be.visible')
      .and('not.be.disabled');
  });

  it.only('should allow bulk upload of keywords', () => {
    cy.get(
      `[data-test=${KeywordTrackerDataTestIds.ADD_KEYWORD_DIALOG}]`
    ).should('be.visible');

    cy.get(
      `[data-test=${KeywordTrackerDataTestIds.BULK_UPLOAD_CONTAINER}]`
    ).should('be.visible');

    const filePath = 'Keyword_BulkUpload_Sample.csv';
    cy.get('input[type="file"]').selectFile(`cypress/fixtures/${filePath}`, {
      force: true,
    });

    cy.wait(5000);

    cy.get(
      `[data-test=${KeywordTrackerDataTestIds.BULK_UPLOAD_CONTAINER}]`
    ).within(() => {
      cy.contains('Keyword_BulkUpload_Sample.csv').should('be.visible');
    });

    cy.get(`[data-test=${KeywordTrackerDataTestIds.ADD_KEYWORD_DIALOG}] button`)
      .should('be.visible')
      .and('not.be.disabled');
  });

  it('should be able to download template', () => {
    cy.get(
      `[data-test="${KeywordTrackerDataTestIds.DOWNLOAD_FILE_CONTAINER}"]`
    ).should('be.visible');
    cy.get(
      `[data-test="${KeywordTrackerDataTestIds.DOWNLOAD_FILE_CONTAINER}"] a`
    )
      .should('be.visible')
      .and('have.attr', 'href')
      .then((href) => {
        expect(href).to.include(
          'https://anarix.s3.amazonaws.com/sample-files/Keyword_BulkUpload_Sample.csv'
        );
      });

    cy.get(
      `[data-test="${KeywordTrackerDataTestIds.DOWNLOAD_FILE_CONTAINER}"] a`
    ).then(($a) => {
      const url = $a.prop('href');
      cy.request(url).then((response) => {
        expect(response.status).to.eq(200);
      });
    });
  });

  it('should close the dialog when clicking the Close button', () => {
    cy.get(
      `[data-test=${KeywordTrackerDataTestIds.ADD_KEYWORD_DIALOG}]`
    ).should('be.visible');
    cy.get('#close-button').click();
    cy.get(
      `[data-test=${KeywordTrackerDataTestIds.ADD_KEYWORD_DIALOG}]`
    ).should('not.exist');
    cy.wait(5000);
  });
});

// test for keyword tracking process
describe('Keyword Tracking Process', () => {
  beforeEach(() => {
    cy.loginAndSelectAccount(
      'anarix_qa@mailinator.com',
      'Napqueen@123',
      '6527f0a6be26660071c5dfac'
    );
    cy.wait(5000);
    cy.navigateToSubMenu('market-intelligence', 'keyword-tracker');
    cy.get(`[data-test="${KeywordTrackerDataTestIds.TABLE_BUTTON_CONTAINER}"]`)
      .find('.MuiButtonBase-root.MuiButton-root.MuiButton-contained')
      .click();
  });

  it('should track keywords and update status successfully', () => {
    cy.get(
      `[data-test="${KeywordTrackerDataTestIds.ADD_KEYWORD_DIALOG}"]`
    ).should('be.visible');

    cy.get(
      `[data-test="${GlobalDataTestIds.MULTI_SELECT_DROPDOWN}"] .MuiSelect-select`
    ).click();
    cy.get('[role="listbox"]').should('be.visible');
    cy.get('[role="listbox"] li').eq(1).click();
    cy.get('body').click();

    const keywords = [
      `test${Date.now()}`,
      `random${Math.floor(Math.random() * 1000)}`,
    ];

    cy.intercept(
      'POST',
      'https://api.test.anarix.ai/api/market-intelligence/serp/keywords'
    ).as('trackKeywords');

    keywords.forEach((keyword) => {
      cy.get(
        `[data-test="${KeywordTrackerDataTestIds.ENTER_KEYWORDS_INPUT}"] input[type="text"]`
      ).type(`${keyword}{enter}`);
    });

    cy.get('[data-test="track-keywords-button"]')
      .should('be.visible')
      .should('not.be.disabled')
      .click();

    cy.wait('@trackKeywords').then((interception) => {
      expect(interception.response?.statusCode).to.eq(200);
    });

    cy.get(`[data-test="${GlobalDataTestIds.TOAST_WRAPPER}"]`)
      .should('exist')
      .find('span')
      .should('contain.text', 'Keyword Addition Successful');

    keywords.forEach((keyword) => {
      cy.get(
        `[data-test="${KeywordTrackerDataTestIds.TABLE_BUTTON_CONTAINER}"]`
      ).within(() => {
        cy.wait(5000);
        cy.get('input[placeholder="Search by Keyword"]').clear().type(keyword);
      });

      cy.wait(2000);

      cy.get(`[data-test="${GlobalDataTestIds.CUSTOM_TABLE_WRAPPER}"] tbody tr`)
        .first()
        .should('contain.text', keyword)
        .within(() => {
          cy.get('[data-test="toggle-status"]').click();
        });

      cy.get('[role="dialog"]').should('be.visible');
      cy.contains('button', 'Change').click();

      cy.get(`[data-test="${GlobalDataTestIds.TOAST_WRAPPER}"]`)
        .should('exist')
        .find('span')
        .should('contain.text', 'Keyword Updation Successful');

      cy.get(
        `[data-test="${KeywordTrackerDataTestIds.TABLE_BUTTON_CONTAINER}"]`
      ).within(() => {
        cy.get('h6').contains('Clear').should('be.visible').click();
        cy.get('input[placeholder="Search by Keyword"]').should(
          'have.value',
          ''
        );
      });
    });

    cy.get('[role="tab"]').contains('Inactive').click();

    keywords.forEach((keyword) => {
      cy.get(
        `[data-test="${KeywordTrackerDataTestIds.TABLE_BUTTON_CONTAINER}"]`
      ).within(() => {
        cy.wait(5000);
        cy.get('input[placeholder="Search by Keyword"]').clear().type(keyword);
      });

      cy.wait(2000);

      cy.get(`[data-test="${GlobalDataTestIds.CUSTOM_TABLE_WRAPPER}"] tbody tr`)
        .first()
        .within(() => {
          cy.get('[data-test="delete-keyword"]').click();
        });

      cy.get('[role="dialog"]').should('be.visible');
      cy.contains('button', 'Delete').click();

      cy.get(`[data-test="${GlobalDataTestIds.TOAST_WRAPPER}"]`)
        .should('exist')
        .find('span')
        .should('contain.text', 'Keyword Deletion Successful');

      cy.get(
        `[data-test="${GlobalDataTestIds.CUSTOM_TABLE_WRAPPER}"] tbody`
      ).should('not.contain.text', keyword);
    });
  });
});

// test for checkboxes for marketplaces
describe('Checkboxes Popup Validation', () => {
  beforeEach(() => {
    cy.loginAndSelectAccount(
      'anarix_qa@mailinator.com',
      'Napqueen@123',
      '6527f0a6be26660071c5dfac'
    );
    cy.wait(5000);
    cy.navigateToSubMenu('market-intelligence', 'keyword-tracker');
  });

  it('should validate checkboxes and buttons in popup', () => {
    cy.get(`[data-test=${GlobalDataTestIds.CUSTOM_TABLE_WRAPPER}]`).should(
      'be.visible'
    );

    cy.get(`[data-test=${GlobalDataTestIds.CUSTOM_TABLE_WRAPPER}] tbody tr`)
      .first()
      .within(() => {
        cy.get('[data-test="toggle-status"]').as('statusButton').click();
      });

    cy.get('[role="dialog"]').as('confirmationPopup').should('be.visible');

    cy.get('@confirmationPopup').within(() => {
      cy.contains('h4', 'Confirmation').should('be.visible');
      cy.contains('Are you sure you want to change the status?').should(
        'be.visible'
      );
    });

    cy.get('input[name="amazon"]').as('amazonCheckbox').should('be.checked');
    cy.get('input[name="walmart"]').as('walmartCheckbox').should('be.checked');

    cy.get('@amazonCheckbox').click().should('not.be.checked');
    cy.get('@walmartCheckbox').click().should('not.be.checked');

    cy.get('@amazonCheckbox').click().should('be.checked');
    cy.get('@walmartCheckbox').click().should('be.checked');

    cy.contains('button', 'Cancel').should('be.visible');
    cy.contains('button', 'Change').should('be.visible');

    cy.contains('button', 'Cancel').click();
    cy.get('@confirmationPopup').should('not.exist');
  });
});

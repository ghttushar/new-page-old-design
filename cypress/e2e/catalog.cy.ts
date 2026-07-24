import { CatalogDataTestIds } from '../enums/catalog';
import { GlobalDataTestIds } from '../enums/global';

describe('Check if every component exists on the page', () => {
  before(() => {
    cy.loginAndSelectAccount(
      'anarix_qa@mailinator.com',
      'Napqueen@123',
      '6527f0a6be26660071c5dfac'
    ).then(() => {
      cy.wait(2000);
      cy.saveSession();
    });
  });

  beforeEach(() => {
    cy.restoreSession();
    cy.wait(1000);
    cy.visit('/catalog/catalog-page');
  });

  it('checks if the placeholder is present', () => {
    cy.get(`[data-test=${GlobalDataTestIds.EMPTY_PLACEHOLDER}`).should(
      'be.visible'
    );
    cy.contains('h3', 'Catalog Not Available').should('be.visible');
    cy.contains(
      'h6',
      'The catalog for this marketplace is not yet configured. Please check back later.'
    ).should('be.visible');
  });

  it('checks if the marketplace gets changed or not and check filters', () => {
    cy.selectMarketplace('(3P) NapQueen');

    cy.get(`[data-test=${GlobalDataTestIds.SEARCH_WRAPPER}] input`)
      .should('not.be.disabled')
      .should('be.visible')
      .click()
      .type('Sample Product', { force: true })
      .should('have.value', 'Sample Product');

    cy.get(`[data-test=${CatalogDataTestIds.CATALOG_FILTER}]`).click();
    cy.get(`[data-test=${CatalogDataTestIds.CATALOG_FILTER}]`).should(
      'be.visible'
    );
    cy.get(`[data-test=${CatalogDataTestIds.CATALOG_FILTER}]`).click();
    cy.get(`[data-test=${CatalogDataTestIds.CATALOG_COLUMN_FILTER}]`).click();
    cy.get(`[data-test=${CatalogDataTestIds.CATALOG_COLUMN_FILTER}]`).should(
      'be.visible'
    );
    cy.get(`[data-test=${CatalogDataTestIds.CATALOG_COLUMN_FILTER}]`).should(
      'exist'
    );
    cy.get(`[data-test=${GlobalDataTestIds.DOWNLOAD_BUTTON}] button`).should(
      'exist'
    );
    cy.get(`[data-test=${CatalogDataTestIds.UPLOAD_COGS_BUTTON}]`).should(
      'exist'
    );

    cy.get(`[data-test=${GlobalDataTestIds.ADDED_FILTERS_TAB}]`).should(
      'exist'
    );
    cy.get(`[data-test=${GlobalDataTestIds.ADDED_FILTERS_CONTAINER}]`).should(
      'exist'
    );
    cy.get(`[data-test=${GlobalDataTestIds.SINGLE_FILTER_CONTAINER}]`).should(
      'exist'
    );
    cy.get(`[data-test=${GlobalDataTestIds.CLEAR_BUTTON}]`).should('exist');
    cy.get(`[data-test=${GlobalDataTestIds.SINGLE_FILTER_CONTAINER}] p`)
      .should('exist')
      .and('contain', 'Status is PUBLISHED');
    cy.get(
      `[data-test=${GlobalDataTestIds.SINGLE_FILTER_CONTAINER}] button`
    ).should('exist');
  });
});

describe('Search Bar Functionality', () => {
  before(() => {
    cy.loginAndSelectAccount(
      'anarix_qa@mailinator.com',
      'Napqueen@123',
      '6527f0a6be26660071c5dfac'
    ).then(() => {
      cy.wait(2000);
      cy.saveSession();
    });
  });

  beforeEach(() => {
    cy.restoreSession();
    cy.wait(1000);
    cy.visit('/catalog/catalog-page');
  });

  const testCases = [
    { searchValue: 'NQ721231', expectedRows: 1 },
    { searchValue: '876019681', expectedRows: 1 },
    {
      searchValue:
        'NapQueen Elizabeth 12" Twin Mattress, Cooling Gel Infused Memory Foam, Bed in a Box, Adult',
      expectedRows: 2,
    },
  ];

  testCases.forEach(({ searchValue, expectedRows }) => {
    it(`should search for "${searchValue}", verify one row in the table, and then clear the search`, () => {
      cy.selectMarketplace('(3P) NapQueen');
      cy.get(`[data-test=${GlobalDataTestIds.SEARCH_WRAPPER}] input`).type(
        searchValue,
        { force: true }
      );
      cy.get(`[data-test=${GlobalDataTestIds.SEARCH_WRAPPER}] h6`)
        .contains('Search')
        .click();
      cy.get('[data-test="table-tbody"] tr').should(
        'have.length',
        expectedRows
      );
      cy.get(`[data-test=${GlobalDataTestIds.SEARCH_WRAPPER}] h6`)
        .contains('Clear')
        .click();
      cy.get(`[data-test=${GlobalDataTestIds.SEARCH_WRAPPER}] input`).should(
        'have.value',
        ''
      );
    });
  });
});

describe('Download Button Tests', () => {
  before(() => {
    cy.loginAndSelectAccount(
      'anarix_qa@mailinator.com',
      'Napqueen@123',
      '6527f0a6be26660071c5dfac'
    ).then(() => {
      cy.wait(2000);
      cy.saveSession();
    });
  });

  beforeEach(() => {
    cy.restoreSession();
    cy.wait(1000);
    cy.visit('/catalog/catalog-page');
    cy.selectMarketplace('(3P) NapQueen');
  });

  it('should display the download options when the button is clicked', () => {
    cy.get('[data-test="download-button"]').click();

    cy.get('[data-test="download_options-container"]').should('be.visible');

    cy.get('[data-test="download_options-container"] span')
      .should('have.length', 2)
      .and('contain', 'Download with Filters')
      .and('contain', 'Download all Results');
  });

  it('should call the correct API when "Download with Filters" is clicked', () => {
    cy.intercept(
      'POST',
      'https://api.test.anarix.ai/api/advertising/walmart/catalog?page=0&pageSize=50'
    ).as('downloadWithFilters');
    cy.get('[data-test="download-button"]').click();
    cy.contains('Download with Filters').click();

    cy.wait('@downloadWithFilters')
      .its('response.statusCode')
      .should('eq', 200);
  });

  it('should call the correct API when "Download all Results" is clicked', () => {
    cy.get('[data-test="download-button"]').click();
    cy.intercept(
      'POST',
      'https://api.test.anarix.ai/api/advertising/walmart/catalog?page=0&pageSize=50'
    ).as('downloadAllResults');
    cy.contains('Download all Results').click();

    cy.wait('@downloadAllResults').its('response.statusCode').should('eq', 200);
  });
});

describe('Upload Cogs Button Tests', () => {
  before(() => {
    cy.loginAndSelectAccount(
      'anarix_qa@mailinator.com',
      'Napqueen@123',
      '6527f0a6be26660071c5dfac'
    ).then(() => {
      cy.wait(2000);
      cy.saveSession();
    });
  });

  beforeEach(() => {
    cy.restoreSession();
    cy.wait(1000);
    cy.visit('/catalog/catalog-page');
    cy.selectMarketplace('(3P) NapQueen');
  });

  it('should display the download options when the button is clicked and input valid file', () => {
    cy.get(`[data-test=${CatalogDataTestIds.UPLOAD_COGS_BUTTON}]`).click();
    cy.get(`[data-test=${GlobalDataTestIds.UPLOAD_FILE_DIALOG}]`).should(
      'be.visible'
    );

    cy.get(`[data-test=${GlobalDataTestIds.UPLOAD_BUTTON}]`).should(
      'be.disabled'
    );

    cy.get('input[type="file"]').selectFile(
      'cypress/fixtures/COGS_BulkUpload_Sample.csv',
      {
        force: true,
      }
    );
    cy.get(`[data-test=${GlobalDataTestIds.UPLOAD_BUTTON}]`).should(
      'not.be.disabled'
    );

    cy.wait(5000);

    cy.get('button:contains("Cancel")').click();
    cy.get(`[data-test=${GlobalDataTestIds.UPLOAD_FILE_DIALOG}]`).should(
      'not.exist'
    );
  });

  it('should display the download options when the button is clicked and input invalid file', () => {
    cy.get(`[data-test=${CatalogDataTestIds.UPLOAD_COGS_BUTTON}]`).click();
    cy.get(`[data-test=${GlobalDataTestIds.UPLOAD_FILE_DIALOG}]`).should(
      'be.visible'
    );

    cy.get(`[data-test=${GlobalDataTestIds.UPLOAD_BUTTON}]`).should(
      'be.disabled'
    );
    cy.get('input[type="file"]').selectFile(
      'cypress/fixtures/invalid-file.png',
      { force: true }
    );
    cy.get(`[data-test=${GlobalDataTestIds.UPLOAD_BUTTON}]`).should(
      'be.disabled'
    );

    cy.wait(5000);

    cy.get('button:contains("Cancel")').click();
    cy.get(`[data-test=${GlobalDataTestIds.UPLOAD_FILE_DIALOG}]`).should(
      'not.exist'
    );
  });

  it('should download the template file when clicking "Download Template"', () => {
    cy.get(`[data-test=${CatalogDataTestIds.UPLOAD_COGS_BUTTON}]`).click();

    cy.get('a')
      .contains('Download Template')
      .invoke('attr', 'href')
      .then((fileUrl) => {
        expect(fileUrl)
          .to.be.a('string')
          .and.include('COGS_BulkUpload_Sample.csv');

        if (fileUrl) {
          cy.request(fileUrl).then((response) => {
            expect(response.status).to.eq(200);
            expect(response.headers['content-type']).to.include('text/csv');
          });
        }
      });
  });
});

describe('Custom Table Wrapper Tests', () => {
  const emptyColumns = ['Status', 'Price', 'Advertised (Yes/No)'];
  const defaultColumns = [
    'Status',
    'Reviews & Ratings',
    'Inventory Count',
    'Inventory Value (COGS)',
    'Inventory Value (Retail)',
    'Price',
    'COGS',
    'Total Sales',
    'GMV',
    'Total Units',
    'Refund Sales',
    'Cancelled Sales',
    'Advertised (Yes/No)',
    'Ad Spend',
    'Ad Sales',
    'RoAS',
    'TACoS',
    'Ad Units',
    'ACoS',
  ];
  const headers = [
    'Product Details',
    'Product Performance',
    'Inventory',
    'Revenue & Cost',
    'Ads',
  ];
  before(() => {
    cy.loginAndSelectAccount(
      'anarix_qa@mailinator.com',
      'Napqueen@123',
      '6527f0a6be26660071c5dfac'
    ).then(() => {
      cy.wait(2000);
      cy.saveSession();
    });
  });

  beforeEach(() => {
    cy.restoreSession();
    cy.wait(1000);
    cy.visit('/catalog/catalog-page');
    cy.selectMarketplace('(3P) NapQueen');
  });

  it('should validate table functionalities', () => {
    cy.get(`[data-test=${GlobalDataTestIds.CUSTOM_TABLE_WRAPPER}]`).should(
      'be.visible'
    );

    cy.get(`[data-test=${GlobalDataTestIds.CUSTOM_TABLE_WRAPPER}]`)
      .find('thead th')
      .should('have.length.greaterThan', 0);

    cy.get(`[data-test=${GlobalDataTestIds.CUSTOM_TABLE_WRAPPER}]`)
      .find('tbody tr')
      .should('have.length.greaterThan', 0);

    cy.get(`[data-test=${GlobalDataTestIds.CUSTOM_TABLE_WRAPPER}]`)
      .find('thead th')
      .first()
      .click();

    cy.get(`[data-test=${GlobalDataTestIds.CUSTOM_TABLE_WRAPPER}] tbody tr`)
      .first()
      .invoke('text')
      .as('firstRowTextBefore');

    cy.get(`[data-test=${GlobalDataTestIds.CUSTOM_TABLE_WRAPPER}]`)
      .find('thead th')
      .first()
      .click();

    cy.get(`[data-test=${GlobalDataTestIds.CUSTOM_TABLE_WRAPPER}] tbody tr`)
      .first()
      .invoke('text')
      .should('not.eq', '@firstRowTextBefore');

    cy.get(`[data-test=${GlobalDataTestIds.CUSTOM_TABLE_WRAPPER}] tbody tr`)
      .first()
      .should('exist');

    cy.verifyTableColumns(defaultColumns);
    cy.verifyTableHeaderColumns(headers);
    cy.checkPagination();
  });

  it('should validate product details for all rows', () => {
    cy.get(`[data-test=${GlobalDataTestIds.CUSTOM_TABLE_WRAPPER}]`).should(
      'be.visible'
    );

    cy.get(`[data-test=${GlobalDataTestIds.PRODUCT_CONTAINER}]`).each(
      ($row, index) => {
        cy.wrap($row).within(() => {
          cy.get(`[data-test=${GlobalDataTestIds.PRODUCT_META_DATA}]`).within(
            () => {
              cy.contains('b', 'SKU')
                .parent()
                .scrollIntoView()
                .invoke('text')
                .then((sku) => {
                  cy.log(
                    `Checking Product Row ${index + 1} - SKU: ${sku.trim()}`
                  );
                });
            }
          );

          cy.get(`[data-test=${GlobalDataTestIds.PRODUCT_NAME}]`).then(
            ($el) => {
              if ($el.is(':visible')) {
                cy.wrap($el)
                  .scrollIntoView()
                  .should('have.attr', 'href')
                  .and('include', 'https://www.walmart.com/ip/');
              } else {
                cy.log(`⚠️ Product Name Link is hidden in Row ${index + 1}`);
              }
            }
          );

          cy.get('img')
            .scrollIntoView()
            .invoke('attr', 'src')
            .then((imgSrc) => {
              cy.log(`🖼️ Image URL for Row ${index + 1}: ${imgSrc}`);
              expect(imgSrc).to.include('https://i5.walmartimages.com');
            });

          cy.get(`[data-test=${GlobalDataTestIds.PRODUCT_META_DATA}]`).within(
            () => {
              cy.contains('b', 'ID')
                .parent()
                .scrollIntoView()
                .should('not.be.empty');
              cy.contains('b', 'SKU')
                .parent()
                .scrollIntoView()
                .should('not.be.empty');
              cy.get('p b').eq(2).scrollIntoView().should('not.be.empty');
              cy.get('p b').eq(3).scrollIntoView().should('not.be.empty');
            }
          );
        });
      }
    );
  });

  it('should validate that all <td> elements are present and only certain columns can be empty', () => {
    cy.get(`[data-test=${GlobalDataTestIds.CUSTOM_TABLE_WRAPPER}]`).should(
      'be.visible'
    );
    cy.get('tfoot').should('exist');

    cy.get('tfoot tr td').each(($td, index) => {
      const text = $td.text().trim();
      cy.log(`Footer Column ${index + 1}: ${text}`);
      cy.get('thead th')
        .eq(index)
        .invoke('text')
        .then((headerText: string) => {
          const columnName = headerText.trim();

          if (emptyColumns.some((col) => col === columnName)) {
            cy.log(`⚠️ Column "${columnName}" is allowed to be empty.`);
          } else {
            cy.wrap($td).should('not.be.empty');
          }
        });
    });
  });
});

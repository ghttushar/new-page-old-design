import { GlobalDataTestIds } from '../enums/global';

describe('Checking the elements exists or not', () => {
  beforeEach(() => {
    cy.loginAndSelectAccount(
      'anarix_qa@mailinator.com',
      'Napqueen@123',
      '6527f0a6be26660071c5dfac'
    );
    cy.wait(5000);
    cy.navigateToSubMenu('market-intelligence', 'brand-sov');
    cy.wait(5000);
  });

  it('checks if the header and filter elements are present', () => {
    cy.checkMarketplace('Marketplace');
    cy.checkMarketplaceDD();
    cy.checkProfile();
    cy.checkPageName('Brand SOV');

    cy.get('input[id="searchable-dropdown"]').should('exist');
    cy.get('[data-test="custom-date-range-picker-wrapper"]').should('exist');
    cy.get(`[data-test=${GlobalDataTestIds.MARKETPLACE_DROPDOWN}]`)
      .contains('Position')
      .should('exist');
    cy.get(`[data-test=${GlobalDataTestIds.MARKETPLACE_DROPDOWN}]`)
      .contains('Frequency')
      .should('exist');
    cy.get('input[id="searchable-dropdown"]').eq(1).should('exist');
    cy.get('[data-test="primary-button"] button').should('be.disabled');
  });

  it('checks if the metric elements are present', () => {
    cy.get('[data-test="brand-metrics"]').should('exist');
    cy.contains('p', 'Your Brand').should('exist');
    cy.get('h5._brandTitle_mt1j4_58').should('exist');
    cy.get('[data-test="metrice-data-Organic SOV (%)"]').should('exist');
    cy.get('[data-test="metrice-data-Sponsored SOV (%)"]').should('exist');
    cy.get('[data-test="metrice-data-Total SOV (%)"]').should('exist');
    cy.get('[data-test="metrice-data-Product Count (Unique)"]').should('exist');
  });

  it('checks if the graph elements are present', () => {
    cy.get('[data-test="sov-graph-wrapper"]').should('be.visible');
    cy.get('[data-test="sov-graph-header"]').should('be.visible');
    cy.get('[data-test="sov-graph-header"]')
      .contains('Time range:')
      .should('be.visible');
    cy.get('[data-test="sov-graph-header-button"] button')
      .contains('Hide Chart')
      .should('be.visible');
    cy.get(
      '[data-test="sov-graph-header-button"] button[title="Expand"]'
    ).should('be.visible');
    cy.get('[data-test="sov-horizontal-line"]').should('exist');
    cy.get('[data-test="sov-graph-body"]').should('be.visible');
    cy.get('[data-test="legend-container"]').should('exist');
    cy.get('[data-test="graph-canvas"]').should('be.visible');
    cy.get('#custom-tooltip-container').should('exist');
  });

  it('checks if the table header elements are present', () => {
    cy.get('[data-test="table-header"]').should('be.visible');

    cy.get('[data-test="table-header"]')
      .contains('All Brand Coverage')
      .should('be.visible');
    cy.get('[data-test="table-header"] button')
      .contains('Brand')
      .should('be.visible');
    cy.get('[aria-label="Download"]').should('be.visible');
  });

  it('should verify the table container is present', () => {
    cy.get('[data-test="report-container"]').should('exist');
    const columns = [
      'Sl No.',
      'Brand',
      'Product Count (Unique)',
      'Appearance(%)',
      'Organic SOV(%)',
      'Sponsored SOV(%)',
      'Total SOV(%)',
    ];
    cy.verifyTableColumns(columns);
    cy.checkPagination();
  });
});

describe('Checking functionality of result component', () => {
  beforeEach(() => {
    cy.loginAndSelectAccount(
      'anarix_qa@mailinator.com',
      'Napqueen@123',
      '6527f0a6be26660071c5dfac'
    );
    cy.wait(5000);
    cy.navigateToSubMenu('market-intelligence', 'brand-sov');
    cy.wait(5000);
  });

  it('should display the correct brand metrics in the result component', () => {
    cy.request({
      method: 'GET',
      url: 'https://api.test.anarix.ai/api/market-intelligence/serp/brand/metrics',
      qs: {
        keyword: 'full mattress',
        position: '',
        frequency: 'hourly',
        range: 'YESTERDAY',
        brandName: 'napqueen',
        marketplace: 'amazon',
      },
      headers: {
        Authorization:
          'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFuYXJpeF9xYUBtYWlsaW5hdG9yLmNvbSIsImlkIjoiNjUyN2YwYTZiZTI2NjYwMDcxYzVkZmFmIiwiaWF0IjoxNzM5ODgxODMxLCJleHAiOjE3NDI0NzM4MzF9.3c0KOmL_ZTSnXcToy_lnavBk8Fgg6OQfTfvEDs5YtZY',
        'user-agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Safari/537.36',
        accept: '/',
        'accept-encoding': 'gzip, deflate',
        accountID: '6527f0a6be26660071c5dfac',
      },
    }).then((response) => {
      const apiData = response.body.data;
      cy.log('API Data:', apiData);

      cy.get('[data-test="brand-metrics"]')
        .find('[data-test="brand-title"]')
        .invoke('text')
        .then((resultBrandName) => {
          resultBrandName = resultBrandName
            .trim()
            .replace(/\s*\(.*\)\s*/g, '')
            .toLowerCase();
          const brandName = apiData.brand.toLowerCase();
          cy.log('Expected Brand Name:', brandName);
          expect(resultBrandName).to.equal(brandName);
        });

      cy.get(
        '[data-test="metrice-data-Organic SOV (%)"], [data-test="metrice-data-Sponsored SOV (%)"], [data-test="metrice-data-Total SOV (%)"], [data-test="metrice-data-Product Count (Unique)"]'
      ).each(($element) => {
        const testAttr = $element.attr('data-test');

        const h5Text = $element.find('h5').text().trim();
        const h6Text = $element.find('h6').text().trim();
        const pText = $element.find('p').last().text().trim();

        if (testAttr === 'metrice-data-Organic SOV (%)') {
          expect(h5Text).to.equal(`${apiData.organicSov.current}%`);
          expect(h6Text).to.equal(`${apiData.organicSov.changePercentage}%`);
          expect(pText).to.equal(
            `${apiData.organicSov.previousDateRangeText}: ${apiData.organicSov.previous}%`
          );
        }

        if (testAttr === 'metrice-data-Sponsored SOV (%)') {
          expect(h5Text).to.equal(`${apiData.sponsoredSov.current}%`);
          expect(h6Text).to.equal(`${apiData.sponsoredSov.changePercentage}%`);
          expect(pText).to.equal(
            `${apiData.sponsoredSov.previousDateRangeText}: ${apiData.sponsoredSov.previous}%`
          );
        }

        if (testAttr === 'metrice-data-Total SOV (%)') {
          expect(h5Text).to.equal(`${apiData.totalSov.current}%`);
          expect(h6Text).to.equal(`${apiData.totalSov.changePercentage}%`);
          expect(pText).to.equal(
            `${apiData.totalSov.previousDateRangeText}: ${apiData.totalSov.previous}%`
          );
        }

        if (testAttr === 'metrice-data-Product Count (Unique)') {
          expect(h5Text).to.equal(
            apiData.uniqueProductCount.current.toString()
          );
          expect(h6Text).to.equal(
            `${apiData.uniqueProductCount.changePercentage}%`
          );
          expect(pText).to.equal(
            `${apiData.uniqueProductCount.previousDateRangeText}: ${apiData.uniqueProductCount.previous}`
          );
        }
      });
    });
  });
});

describe('Checking the functionality of the graph', () => {
  beforeEach(() => {
    cy.loginAndSelectAccount(
      'anarix_qa@mailinator.com',
      'Napqueen@123',
      '6527f0a6be26660071c5dfac'
    );
    cy.wait(5000);
    cy.navigateToSubMenu('market-intelligence', 'brand-sov');
    cy.wait(5000);
  });

  it('Checks if the time range in the graph header matches the selected dropdown value', () => {
    cy.get('button[role="combobox"] span')
      .invoke('text')
      .then((selectedDate) => {
        const formattedDate = selectedDate.replace(/,\s*\d{4}/, '').trim();
        const expectedText = `Time range: ${formattedDate} (Hourly)`;

        cy.get('[data-test="sov-graph-header"] h5')
          .should('be.visible')
          .should('have.text', expectedText);
      });
  });

  it('Checks Hide Chart and Expand functionality', () => {
    cy.get('[data-test="sov-graph-header-button"] button')
      .contains('Hide Chart')
      .should('be.visible');

    cy.get('[data-test="sov-graph-header-button"] button[title="Expand"]')
      .should('be.visible')
      .click();
    cy.get('.MuiDialog-paper')
      .should('be.visible')
      .within(() => {
        cy.contains('button', 'Download as PNG').should('be.visible');

        cy.get('button[title="Condense"]').should('be.visible').click();
      });

    cy.get('.MuiDialog-paper').should('not.exist');

    cy.get('[data-test="sov-graph-header-button"] button')
      .contains('Hide Chart')
      .click();

    cy.contains('button', 'Show Chart').should('be.visible').click();
  });
});

describe('Checking the functionality of the table header and table', () => {
  const columns = [
    'Sl No.',
    'Brand',
    'Product Count (Unique)',
    'Appearance(%)',
    'Organic SOV(%)',
    'Sponsored SOV(%)',
    'Total SOV(%)',
  ];
  const verifyBrandFilter = (brandName: string, length: number) => {
    cy.get('button').contains('Brand').should('be.visible').click();

    cy.get('[data-test="option-filter-popup"]').should('be.visible');

    cy.get('[data-test="search-field"] input')
      .should('be.visible')
      .should('have.attr', 'placeholder', 'Search');

    cy.get('[data-test="search-field"] input')
      .should('be.visible')
      .should('not.be.disabled')
      .click({ force: true })
      .type(brandName, { force: true })
      .should('have.value', brandName);

    cy.get('[data-test="options"]')
      .contains(brandName)
      .should('be.visible')
      .closest('label')
      .find('input[type="checkbox"]')
      .should('not.be.disabled')
      .click();

    cy.get('[data-test="options"]')
      .contains(brandName)
      .parent()
      .find('input[type="checkbox"]')
      .should('be.checked');

    cy.get('[data-test="options-header"]')
      .find('button')
      .should('be.visible')
      .click();

    cy.get('[data-test="filter-list"]')
      .should('be.visible')
      .within(() => {
        cy.contains(brandName).should('be.visible');
      });

    cy.get('[data-test="report-container"]').should('exist');

    cy.verifyTableColumns(columns);
    cy.checkPagination();

    cy.get(
      `[data-test=${GlobalDataTestIds.CUSTOM_TABLE_WRAPPER}] tbody tr`
    ).should('have.length', length);

    cy.get(
      `[data-test=${GlobalDataTestIds.CUSTOM_TABLE_WRAPPER}] tbody tr td:nth-child(2)`
    ).should('contain.text', brandName);
  };

  beforeEach(() => {
    cy.loginAndSelectAccount(
      'anarix_qa@mailinator.com',
      'Napqueen@123',
      '6527f0a6be26660071c5dfac'
    );
    cy.wait(5000);
    cy.navigateToSubMenu('market-intelligence', 'brand-sov');
    cy.wait(5000);
  });

  it('Verifies table header functionality', () => {
    cy.get('h4').should('be.visible').should('have.text', 'All Brand Coverage');

    cy.get('[aria-label="Download"]').should('be.visible').click();

    verifyBrandFilter('novilla', 2);
    verifyBrandFilter('zinus', 2);

    cy.get(
      `[data-test=${GlobalDataTestIds.CUSTOM_TABLE_WRAPPER}] tbody tr td:nth-child(2)`
    )
      .should('contain.text', 'napqueen')
      .and('contain.text', 'zinus');

    cy.get('[data-test="filter-list"]')
      .contains('zinus')
      .parent()
      .find('button')
      .click();

    verifyBrandFilter('novilla', 2);

    cy.get('[data-test="filter-list"]')
      .find('button')
      .contains('Clear')
      .click();

    cy.get('[data-test="filter-list"]').should('not.exist');
    cy.verifyTableColumns(columns);
    cy.checkPagination();

    cy.get(
      `div[data-test=${GlobalDataTestIds.CUSTOM_TABLE_WRAPPER}] tbody tr`
    ).each(($row) => {
      cy.wrap($row).scrollIntoView();

      cy.wrap($row)
        .find('td:nth-child(2)')
        .invoke('text')
        .then((brandName) => {
          brandName = brandName.trim();

          cy.wrap($row).find('button').click({ force: true });

          cy.get('[data-test="sov-graph-wrapper"]').should('be.visible');
          cy.get('[data-test="sov-graph-trend-header"]').should('be.visible');

          cy.get('[name="organic_sov"]').should('be.checked');
          cy.get('[name="sponsored_sov"]').should('be.checked');
          cy.get('[name="total_sov"]').should('be.checked');

          cy.get('[data-test="sov-graph-trend-header"]')
            .invoke('text')
            .then((headerText) => {
              headerText = headerText.replace(/\s+/g, ' ');

              expect(headerText).to.include(`Organic SOV ${brandName}`);
              expect(headerText).to.include(`Sponsored SOV ${brandName}`);
              expect(headerText).to.include(`Total SOV ${brandName}`);
            });
        });
    });
  });
});

describe('Checking if it navigates to the brand product page', () => {
  beforeEach(() => {
    cy.loginAndSelectAccount(
      'anarix_qa@mailinator.com',
      'Napqueen@123',
      '6527f0a6be26660071c5dfac'
    );
    cy.wait(5000);
    cy.navigateToSubMenu('market-intelligence', 'brand-sov');
    cy.wait(5000);
  });

  it('should navigate to the brand page', () => {
    cy.get('div[data-test="row-count"]')
      .invoke('text')
      .then((rowCountText) => {
        const match = rowCountText.match(/(\d+)-(\d+)\sof\s(\d+)/);
        if (!match) {
          cy.log('Failed to parse row count.');
          return;
        }

        const start = parseInt(match[1], 10);
        const end = parseInt(match[2], 10);
        const totalRows = parseInt(match[3], 10);

        cy.log(`Found rows: ${start}-${end} of ${totalRows}`);

        function processRow(index = 0) {
          if (index >= end) return;

          cy.get(
            `div[data-test=${GlobalDataTestIds.CUSTOM_TABLE_WRAPPER}] tbody tr`
          )
            .eq(index)
            .then(($row) => {
              if (!$row.length) return;

              cy.wrap($row).scrollIntoView({ ensureScrollable: false });

              cy.wrap($row)
                .find('td:nth-child(2)')
                .invoke('text')
                .then((brandName) => {
                  brandName = brandName.trim();
                  cy.log(`Navigating to brand: ${brandName}`);

                  cy.wrap($row)
                    .find('td:nth-child(2) a')
                    .click({ force: true });

                  cy.url().should(
                    'include',
                    `/market-intelligence/brand-sov/brand-analytics/${encodeURIComponent(
                      brandName
                    )}/amazon`
                  );

                  cy.get('[data-test="page-name"] span')
                    .should('be.visible')
                    .invoke('text')
                    .should('include', `Brand Analytics(${brandName})`);

                  cy.get('[data-test="mi-breadcrumbs"] a')
                    .contains('Business Intelligence')
                    .click({ force: true });

                  cy.url().should(
                    'include',
                    '/market-intelligence/brand-sov/amazon'
                  );

                  cy.wait(5000);
                  processRow(index + 1);
                });
            });
        }

        processRow();
      });
  });
});

describe('The brand product page amazon', () => {
  beforeEach(() => {
    cy.loginAndSelectAccount(
      'anarix_qa@mailinator.com',
      'Napqueen@123',
      '6527f0a6be26660071c5dfac'
    );
    cy.wait(5000);
    cy.navigateToSubMenu('market-intelligence', 'brand-sov');
    cy.wait(5000);

    cy.get(`div[data-test=${GlobalDataTestIds.CUSTOM_TABLE_WRAPPER}] tbody tr`)
      .eq(1)
      .within(() => {
        cy.get('td:nth-child(2) a')
          .invoke('text')
          .then((brandName) => {
            brandName = brandName.trim();
            cy.log(`Navigating to brand: ${brandName}`);
            cy.wrap(brandName).as('brand');

            cy.get('td:nth-child(2) a').click({ force: true });

            cy.url().should(
              'include',
              `/market-intelligence/brand-sov/brand-analytics/${encodeURIComponent(
                brandName
              )}/amazon`
            );
          });
      });
  });

  it('checks if the metric elements are present', () => {
    cy.checkMarketplace('Marketplace');
    cy.checkMarketplaceDD();
    cy.checkProfile();
    cy.get('@brand').then((brand) => {
      cy.checkPageName(`Brand Analytics(${brand})`);
    });

    cy.get('input[id="searchable-dropdown"]').should('exist');
    cy.get('[data-test="custom-date-range-picker-wrapper"]').should('exist');
    cy.get(`[data-test=${GlobalDataTestIds.MARKETPLACE_DROPDOWN}]`)
      .contains('Position')
      .should('exist');
    cy.get(`[data-test=${GlobalDataTestIds.MARKETPLACE_DROPDOWN}]`)
      .contains('Frequency')
      .should('exist');
    cy.get('[data-test="primary-button"] button').should('be.disabled');
    cy.get('[data-test="brand-metrics"]').should('exist');
    cy.contains('p', 'Your Brand').should('exist');
    cy.get('h5._brandTitle_mt1j4_58').should('exist');
    cy.get('[data-test="metrice-data-Organic SOV (%)"]').should('exist');
    cy.get('[data-test="metrice-data-Sponsored SOV (%)"]').should('exist');
    cy.get('[data-test="metrice-data-Total SOV (%)"]').should('exist');
    cy.get('[data-test="metrice-data-Product Count (Unique)"]').should('exist');
  });

  it('checks if the graph elements are present', () => {
    cy.get('[data-test="brand-graph-container"]').should('be.visible');
    cy.get('[data-test="brand-graph-container"]').should('be.visible');
    cy.get('[data-test="brand-graph-container"]')
      .contains('Time range:')
      .should('be.visible');
    cy.get('[data-test="brand-graph-container-button"] button')
      .contains('Hide Chart')
      .should('be.visible');
    cy.get(
      '[data-test="brand-graph-container-button"] button[title="Expand"]'
    ).should('be.visible');
    cy.get('[data-test="product-graph-body"]').should('be.visible');
  });

  it('checks if the table header elements are present', () => {
    cy.get('[data-test="table-header"]').should('be.visible');

    cy.get('[data-test="table-header"]')
      .contains('All Products')
      .should('be.visible');
    cy.get('[aria-label="Download"]').should('be.visible');
  });

  it('should verify the table container is present', () => {
    cy.get('[data-test="brand-sov-product-table"]').should('exist');
    const columns = [
      'Product',
      'Appearance(%)',
      'Price($)',
      'Rating & Reviews',
      'Avg Rank',
      'Avg Org Rank',
      'Avg Sponsored Rank',
    ];
    cy.verifyTableColumns(columns);
    cy.checkPagination();
  });
});

describe('Checking if it navigates to the product page', () => {
  beforeEach(() => {
    cy.loginAndSelectAccount(
      'anarix_qa@mailinator.com',
      'Napqueen@123',
      '6527f0a6be26660071c5dfac'
    );
    cy.wait(5000);
    cy.navigateToSubMenu('market-intelligence', 'brand-sov');
    cy.wait(5000);
    cy.get(`div[data-test=${GlobalDataTestIds.CUSTOM_TABLE_WRAPPER}] tbody tr`)
      .eq(1)
      .within(() => {
        cy.get('td:nth-child(2) a')
          .invoke('text')
          .then((brandName) => {
            brandName = brandName.trim();
            cy.log(`Navigating to brand: ${brandName}`);
            cy.wrap(brandName).as('brand');

            cy.get('td:nth-child(2) a').click({ force: true });

            cy.url().should(
              'include',
              `/market-intelligence/brand-sov/brand-analytics/${encodeURIComponent(
                brandName
              )}/amazon`
            );
          });
      });
  });

  it('should navigate to Amazon for each product', () => {
    cy.get('div[data-test="row-count"]')
      .invoke('text')
      .then((rowCountText) => {
        const match = rowCountText.match(/(\d+)-(\d+)\sof\s(\d+)/);
        if (!match) {
          cy.log('Failed to parse row count.');
          return;
        }
        const end = parseInt(match[2], 10);

        function processRow(index = 0) {
          if (index >= end) return;

          cy.get(
            `div[data-test=${GlobalDataTestIds.CUSTOM_TABLE_WRAPPER}] tbody tr`
          )
            .eq(index)
            .then(($row) => {
              if (!$row.length) return;

              cy.wrap($row).scrollIntoView({ ensureScrollable: false });

              cy.wrap($row)
                .find('td:first-child a[data-test="product-name-product-sov"]')
                .invoke('attr', 'href')
                .then((productLink) => {
                  if (!productLink) {
                    cy.log(`No valid product link found for row ${index + 1}`);
                    processRow(index + 1);
                    return;
                  }

                  cy.log(`Navigating to: ${productLink}`);

                  const absoluteProductLink = productLink.startsWith('http')
                    ? productLink
                    : `https://www.amazon.com${productLink}`;

                  cy.window().then((win) => {
                    win.open(absoluteProductLink, '_blank');
                  });

                  cy.wait(5000);

                  processRow(index + 1);
                });
            });
        }

        processRow();
      });
  });
});

describe('Checking if the marketplace is working', () => {
  beforeEach(() => {
    cy.loginAndSelectAccount(
      'anarix_qa@mailinator.com',
      'Napqueen@123',
      '6527f0a6be26660071c5dfac'
    );
    cy.wait(5000);
    cy.navigateToSubMenu('market-intelligence', 'brand-sov');
    cy.wait(5000);
  });

  it('should verify API calls when switching marketplaces', () => {
    // Intercept Amazon API calls
    cy.intercept(
      'GET',
      'https://api.test.anarix.ai/api/market-intelligence/serp/keywords?marketplace=amazon&includeInactive=false'
    ).as('amazonKeywords');

    cy.intercept(
      'GET',
      'https://api.test.anarix.ai/api/market-intelligence/serp/sov?keyword=full+mattress&position=&frequency=hourly&marketplace=amazon&range=YESTERDAY'
    ).as('amazonSov');

    cy.intercept(
      'GET',
      'https://api.test.anarix.ai/api/market-intelligence/serp/brand/metrics?keyword=full+mattress&position=&frequency=hourly&range=YESTERDAY&brandName=napqueen&marketplace=amazon'
    ).as('amazonBrandMetrics');

    cy.get('[data-test=marketplace-header-Marketplace]').click();
    cy.get('ul[role="listbox"]').within(() => {
      cy.get('li[data-value="walmart"]').click();
    });
    cy.wait(5000);

    cy.intercept(
      'GET',
      'https://api.test.anarix.ai/api/market-intelligence/serp/keywords?marketplace=walmart&includeInactive=false'
    ).as('walmartKeywords');

    cy.intercept(
      'GET',
      'https://api.test.anarix.ai/api/market-intelligence/serp/sov?keyword=full+mattress&position=&frequency=hourly&marketplace=walmart&range=YESTERDAY'
    ).as('walmartSov');

    cy.intercept(
      'GET',
      'https://api.test.anarix.ai/api/market-intelligence/serp/brand/metrics?keyword=full+mattress&position=&frequency=hourly&range=YESTERDAY&brandName=napqueen&marketplace=walmart'
    ).as('walmartBrandMetrics');
  });
});

describe('Checking if it navigates to the product page', () => {
  beforeEach(() => {
    cy.loginAndSelectAccount(
      'anarix_qa@mailinator.com',
      'Napqueen@123',
      '6527f0a6be26660071c5dfac'
    );
    cy.wait(5000);
    cy.navigateToSubMenu('market-intelligence', 'brand-sov');
    cy.wait(5000);
    cy.get('[data-test=marketplace-header-Marketplace]').click();
    cy.get('ul[role="listbox"]').within(() => {
      cy.get('li[data-value="walmart"]').click();
    });
    cy.get(`div[data-test=${GlobalDataTestIds.CUSTOM_TABLE_WRAPPER}] tbody tr`)
      .eq(1)
      .within(() => {
        cy.get('td:nth-child(2) a')
          .invoke('text')
          .then((brandName) => {
            brandName = brandName.trim();
            cy.log(`Navigating to brand: ${brandName}`);
            cy.wrap(brandName).as('brand');

            cy.get('td:nth-child(2) a').click({ force: true });

            cy.url().should(
              'include',
              `/market-intelligence/brand-sov/brand-analytics/${encodeURIComponent(
                brandName
              )}/walmart`
            );
          });
      });
  });

  it('should navigate to walmart for each product', () => {
    cy.get('div[data-test="row-count"]')
      .invoke('text')
      .then((rowCountText) => {
        const match = rowCountText.match(/(\d+)-(\d+)\sof\s(\d+)/);
        if (!match) {
          cy.log('Failed to parse row count.');
          return;
        }
        const end = parseInt(match[2], 10);

        function processRow(index = 0) {
          if (index >= end) return;

          cy.get(
            `div[data-test=${GlobalDataTestIds.CUSTOM_TABLE_WRAPPER}] tbody tr`
          )
            .eq(index)
            .then(($row) => {
              if (!$row.length) return;

              cy.wrap($row).scrollIntoView({ ensureScrollable: false });

              cy.wrap($row)
                .find('td:first-child a[data-test="product-name-product-sov"]')
                .invoke('attr', 'href')
                .then((productLink) => {
                  if (!productLink) {
                    cy.log(`No valid product link found for row ${index + 1}`);
                    processRow(index + 1);
                    return;
                  }

                  cy.log(`Navigating to: ${productLink}`);

                  const absoluteProductLink = productLink.startsWith('http')
                    ? productLink
                    : `www.walmart.com/ip/${productLink}`;

                  cy.window().then((win) => {
                    win.open(absoluteProductLink, '_blank');
                  });

                  cy.wait(5000);

                  processRow(index + 1);
                });
            });
        }

        processRow();
      });
  });
});

describe.only('The brand product page walmart', () => {
  beforeEach(() => {
    cy.loginAndSelectAccount(
      'anarix_qa@mailinator.com',
      'Napqueen@123',
      '6527f0a6be26660071c5dfac'
    );
    cy.wait(5000);
    cy.navigateToSubMenu('market-intelligence', 'brand-sov');
    cy.wait(5000);

    cy.get('[data-test=marketplace-header-Marketplace]').click();
    cy.get('ul[role="listbox"]').within(() => {
      cy.get('li[data-value="walmart"]').click();
    });

    cy.get(`div[data-test=${GlobalDataTestIds.CUSTOM_TABLE_WRAPPER}] tbody tr`)
      .eq(1)
      .within(() => {
        cy.get('td:nth-child(2) a')
          .invoke('text')
          .then((brandName) => {
            brandName = brandName.trim();
            cy.log(`Navigating to brand: ${brandName}`);
            cy.wrap(brandName).as('brand');

            cy.get('td:nth-child(2) a').click({ force: true });

            cy.url().should(
              'include',
              `/market-intelligence/brand-sov/brand-analytics/${encodeURIComponent(
                brandName
              )}/walmart`
            );
          });
      });
  });

  it('checks if the metric elements are present', () => {
    cy.checkMarketplace('Marketplace');
    cy.checkMarketplaceDD();
    cy.checkProfile();
    cy.get('@brand').then((brand) => {
      cy.checkPageName(`Brand Analytics(${brand})`);
    });

    cy.get('input[id="searchable-dropdown"]').should('exist');
    cy.get('[data-test="custom-date-range-picker-wrapper"]').should('exist');
    cy.get(`[data-test=${GlobalDataTestIds.MARKETPLACE_DROPDOWN}]`)
      .contains('Position')
      .should('exist');
    cy.get(`[data-test=${GlobalDataTestIds.MARKETPLACE_DROPDOWN}]`)
      .contains('Frequency')
      .should('exist');
    cy.get('[data-test="primary-button"] button').should('be.disabled');
    cy.get('[data-test="brand-metrics"]').should('exist');
    cy.contains('p', 'Your Brand').should('exist');
    cy.get('h5._brandTitle_mt1j4_58').should('exist');
    cy.get('[data-test="metrice-data-Organic SOV (%)"]').should('exist');
    cy.get('[data-test="metrice-data-Sponsored SOV (%)"]').should('exist');
    cy.get('[data-test="metrice-data-Total SOV (%)"]').should('exist');
    cy.get('[data-test="metrice-data-Product Count (Unique)"]').should('exist');
  });

  it('checks if the graph elements are present', () => {
    cy.get('[data-test="brand-graph-container"]').should('be.visible');
    cy.get('[data-test="brand-graph-container"]').should('be.visible');
    cy.get('[data-test="brand-graph-container"]')
      .contains('Time range:')
      .should('be.visible');
    cy.get('[data-test="brand-graph-container-button"] button')
      .contains('Hide Chart')
      .should('be.visible');
    cy.get(
      '[data-test="brand-graph-container-button"] button[title="Expand"]'
    ).should('be.visible');
    cy.get('[data-test="product-graph-body"]').should('be.visible');
  });

  it('checks if the table header elements are present', () => {
    cy.get('[data-test="table-header"]').should('be.visible');

    cy.get('[data-test="table-header"]')
      .contains('All Products')
      .should('be.visible');
    cy.get('[aria-label="Download"]').should('be.visible');
  });

  it('should verify the table container is present', () => {
    cy.get('[data-test="brand-sov-product-table"]').should('exist');
    const columns = [
      'Product',
      'Appearance(%)',
      'Price($)',
      'Rating & Reviews',
      'Avg Rank',
      'Avg Org Rank',
      'Avg Sponsored Rank',
    ];
    cy.verifyTableColumns(columns);
    cy.checkPagination();
  });
});

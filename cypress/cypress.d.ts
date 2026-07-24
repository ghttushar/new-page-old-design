declare namespace Cypress {
  interface Chainable {
    /**
     * Custom command to log in and select an account.
     * @param email - The email for login.
     * @param password - The password for login.
     * @param targetId - The ID of the account to select.
     */
    loginAndSelectAccount(
      email: string,
      password: string,
      targetId: string
    ): Chainable<void>;
    /**
     * Custom command to click a menu item.
     * @param menuItem - The menu item to click.
     * @param subMenuKey - The sub-menu key to click.
     */
    navigateToSubMenu(menuItem: string, subMenuKey: string): Chainable<void>;
    /**
     * Custom command to click a menu item.
     * @param marketplaceText - The menu item to click.
     */
    checkMarketplace(marketplaceText: string): Chainable<void>;
    checkMarketplaceDD(): Chainable<void>;
    checkProfile(): Chainable<void>;
    /**
     * Custom command to click a menu item.
     * @param pageNameText - The menu item to click.
     */
    checkPageName(pageNameText: string): Chainable<void>;
    checkPagination(): Chainable<void>;
    verifyTableColumns(columnNames: array): Chainable<void>;
    verifyTableHeaderColumns(columnNames: array): Chainable<void>;
    saveSession(): Chainable<void>;
    restoreSession(): Chainable<null>;
    selectMarketplace(marketplace: string): Chainable<void>;
  }
}

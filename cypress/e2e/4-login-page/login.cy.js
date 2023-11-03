/// <reference types="cypress" />

// Welcome to Cypress!
//
// This spec file contains a variety of sample tests
// for a todo list app that are designed to demonstrate
// the power of writing tests in Cypress.
//
// To learn more about how Cypress works and
// what makes it such an awesome testing tool,
// please read our getting started guide:
// https://on.cypress.io/introduction-to-cypress

describe('login', () => {
  beforeEach(() => {
    cy.visit('/login');
  });

  it('should able to login', () => {
    cy.login('coffeetsang20@gmail.com', 'wendy123');
  });

  //this tes need to be changed as before active an account, the password is empty, thus it will always show password is wrong
  it('should show user not active', () => {
    //need to create an inactive account in database
    cy.get('[data-testid="email"]').type('testacc@g.com');
    cy.get('[data-testid="password"]').type('wendy123');
    cy.get('[data-testid="login"]').click();
    cy.get('[data-testid="login-tip"]').contains('Wrong Email or Password.');
  });

  it('should show error message when login is incorrect', () => {
    cy.get('[data-testid="email"]').type('kitmanworkk@gmail.com');
    cy.get('[data-testid="password"]').type('1234678');
    cy.get('[data-testid="login"]').click();
    cy.get('[data-testid="login-tip"]').contains('Wrong Email or Password.');
  });
});

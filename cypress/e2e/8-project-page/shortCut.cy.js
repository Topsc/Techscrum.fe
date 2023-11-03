/// <reference types="cypress" />
import projectsData from '../../fixtures/projects.json';
import projectsData2 from '../../fixtures/projectsUpdated.json';

describe('Project page', () => {
  beforeEach(() => {
    let projectList = projectsData;
    cy.intercept('GET', '**/projects', projectList).as('fetch-projects');
    cy.intercept('POST', '**/projects/*/shortcuts', projectList).as('create-shortcut');
    cy.intercept('DELETE', '**/projects/*', (req) => {
      const url = req.url;
      const urlParams = url.split('/');
      const id = urlParams[urlParams.length - 1];
      const newProjectList = [];
      projectList.forEach((project) => {
        if (project.id !== id) newProjectList.push(project);
      });
      projectList = newProjectList;
      return projectList;
    }).as('delete-projects');
    cy.visit('/login');
    cy.login('coffeetsang20@gmail.com', 'wendy123');
    cy.wait('@fetch-projects');
  });

  it('Test Shortcut should exist', () => {
    cy.intercept('GET', '**/projects', projectsData2).as('fetch-projects-2');
    cy.get('[data-testid="evan"]').dblclick();
    cy.get('[data-testid="shortcut-btn"]').dblclick();
    cy.get('[data-testid="add-link"]').dblclick();
    cy.get('[data-testid="add-shortcut-btn"]').should('be.disabled');
    cy.get('[data-testid="shortcut-title"]').clear().type('abc');
    cy.get('[data-testid="invalid-url"]');
    cy.get('[data-testid="shortcut-title"]').clear().type('https://www.google.com');
    cy.get('[data-testid="add-shortcut-btn"]').should('be.disabled');
    cy.get('[data-testid="shortcut-name"]').clear().type('Google');
    cy.get('[data-testid="add-shortcut-btn"]').should('be.enabled');
    cy.get('[data-testid="add-shortcut-btn"]').click();
    cy.wait('@create-shortcut');
    cy.wait('@fetch-projects-2');
    cy.get('[data-testid="shortcut-62fdfa98313b3859ea169821"]');
  });
});

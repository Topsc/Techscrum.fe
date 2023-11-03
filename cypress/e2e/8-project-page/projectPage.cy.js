/// <reference types="cypress" />
import projectsData from '../../fixtures/projects.json';
import rolesData from '../../fixtures/8-project-page/roles.json';
import projectsDeletedData from '../../fixtures/projectsDeleted.json';

describe('Project page', () => {
  beforeEach(() => {
    cy.intercept('GET', '**/projects', projectsData).as('get-projects');
    cy.intercept('GET', '**/roles', rolesData).as('get-roles');
    cy.visit('/login');
    cy.login('coffeetsang20@gmail.com', 'wendy123');
    cy.wait('@get-roles');
    cy.wait('@get-projects');
  });

  it('should search projects and find it in the project list', () => {
    cy.get('[data-testid="search-btn"]').click();
    cy.get('[data-testid="search-input"]').click();
    cy.get('[data-testid="search-input"]').clear();
    cy.get('[data-testid="search-input"]').type('123');
    cy.get('[data-testid="search-result"]').should('have.length', 2);
    cy.get('[data-testid="search-result"]').then((items) => {
      expect(items[0]).to.contain.text('123');
      expect(items[1]).to.contain.text('12333');
    });
  });

  it('check the detail of a project', () => {
    cy.get('[data-testid="project-name"]').eq(1).click();
    cy.url().should('include', '62ea00a670f56ef135b5a579');
  });

  it('delete a project', () => {
    cy.intercept('DELETE', '**/projects/*').as('delete-project');
    cy.get(`[data-testid="project-expand-btn-${projectsData[0].id}"]`).click();
    cy.get('[data-testid="project-delete"]').click();
    cy.get('[data-testid="confirm-delete"]').click();
    cy.intercept('GET', '**/projects', projectsDeletedData).as('get-deleted-projects');
    cy.wait('@delete-project');
    cy.wait('@get-deleted-projects');
    cy.get('[data-testid="project-name"]').should('have.length', projectsData.length - 1);
  });
});

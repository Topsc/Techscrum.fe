/// <reference types="cypress" />

import projectsData from '../../fixtures/8-project-page/projects.json';
import rolesData from '../../fixtures/8-project-page/roles.json';
import usersData from '../../fixtures/8-project-page/users.json';
import projectSelected from '../../fixtures/16-project-settings-page/projectSelected.json';
import projectUpdated from '../../fixtures/16-project-settings-page/projectUpdated.json';

describe('Project setting page', () => {
  beforeEach(() => {
    cy.intercept('GET', '**/projects', projectsData).as('get-projects');
    cy.intercept('GET', '**/roles', rolesData).as('get-roles');
    cy.visit('/login');
    cy.login('coffeetsang20@gmail.com', 'wendy123');
    cy.wait('@get-roles');
    cy.wait('@get-projects');
    cy.intercept('GET', '**/projects', projectsData).as('get-projects');
    cy.intercept('GET', '**/users', usersData).as('get-usersData');
    cy.intercept('GET', '**/projects/*', projectSelected).as('get-selected-project');
    cy.wait('@get-projects');
    cy.get(`[data-testid="project-expand-btn-${projectSelected.id}"]`).click();
    cy.get('[data-testid="project-details"]').click();
    cy.wait('@get-usersData');
    cy.wait('@get-selected-project');
    cy.get('[data-testid="setting-page"]').should('be.exist');
  });

  it('Selected project inputs filled', () => {
    cy.get('[data-testid="projectName"]').should('have.value', projectSelected.name);
    cy.get('[data-testid="projectKey"]').should('have.value', projectSelected.key);
    cy.get('[data-testid="projectLead"]').contains(projectSelected.projectLeadId.name);
    cy.get('[data-testid="websiteUrl"]').should('have.value', projectSelected.websiteUrl);
    cy.get('[data-testid="description"]').should('have.value', projectSelected.description);
  });

  it('Selected project can update', () => {
    cy.intercept('PUT', '**/projects/*', projectUpdated).as('updated-project');
    cy.get('[data-testid="projectName"]').type(projectUpdated.name);
    cy.get('[data-testid="projectKey"]').type(projectUpdated.key);
    cy.get('[data-testid="projectLead"]').click();
    cy.get(`[data-testid="leader-name-${projectUpdated.projectLeadId.name}"]`);
    cy.get('[data-testid="websiteUrl"]').type(projectUpdated.websiteUrl);
    cy.get('[data-testid="description"]').type(projectUpdated.description);
    cy.get('[data-testid="projectUpdateBtn"]').click({force: true});
    cy.wait('@updated-project');
    cy.reload();
    cy.intercept('GET', '**/projects/*', projectUpdated).as('get-updated-project');
    cy.wait('@get-updated-project');
    cy.get('[data-testid="projectName"]').should('have.value', projectUpdated.name);
    cy.get('[data-testid="projectKey"]').should('have.value', projectUpdated.key);
    cy.get('[data-testid="projectLead"]').contains(projectUpdated.projectLeadId.name);
    cy.get('[data-testid="websiteUrl"]').should('have.value', projectUpdated.websiteUrl);
    cy.get('[data-testid="description"]').should('have.value', projectUpdated.description);
  });
});

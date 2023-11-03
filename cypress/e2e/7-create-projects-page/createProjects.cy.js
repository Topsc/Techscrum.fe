/// <reference types="cypress" />

import 'cypress-file-upload';
import projectsData from '../../fixtures/8-project-page/projects.json';
import rolesData from '../../fixtures/8-project-page/roles.json';
import usersData from '../../fixtures/8-project-page/users.json';
import projectsCreatedData from '../../fixtures/7-create-project-page/projectsCreatedData.json';
import newProjectData from '../../fixtures/7-create-project-page/newProjectData.json';

describe('/create-projects', () => {
  beforeEach(() => {
    cy.intercept('GET', '**/projects', projectsData).as('get-projects');
    cy.intercept('GET', '**/roles', rolesData).as('get-roles');
    cy.visit('/login');
    cy.login('coffeetsang20@gmail.com', 'wendy123');
    cy.wait('@get-roles');
    cy.wait('@get-projects');
  });

  it('should be able to create a project', () => {
    const newProjectName = 'new project test';
    cy.intercept('GET', '**/users', usersData).as('get-usersData');
    cy.intercept('POST', '**/projects', newProjectData).as('post-new-project');
    cy.intercept('GET', '**/projects', projectsCreatedData).as('get-projectsCreatedData');
    cy.get('[data-testid="board-create-card"]').click();
    cy.wait('@get-usersData');
    cy.get('[data-testid="project-lead"]').click();
    cy.get(`[data-testid="leader-name-${usersData[0].name}"]`).click();
    cy.get('[data-testid="name"]').type(newProjectName);
    cy.get('[data-testid="websiteUrl"]').type('www.test.com');
    cy.get('[data-testid="project-description"]').type('description test');
    cy.get('[data-testid="save"]').click();
    cy.wait('@post-new-project');
    cy.wait('@get-projectsCreatedData');
    cy.get('[data-testid="project-name"]').should('have.length', projectsCreatedData.length);
    cy.get('[data-testid="project-name"]').last().should('contain', newProjectName);
  });

  it('should not close window when create without name', () => {
    cy.get('[data-testid="board-create-card"]').click();
    cy.get('[data-testid="name"]').type(' ');
    cy.get('[data-testid="save"]').click();
    cy.get('[data-testid="save"]').should('exist');
  });

  it('can change icon', () => {
    cy.get('[data-testid="board-create-card"]').click();
    const pic = 'testPicture.jpg';
    cy.get('[data-testid="iconButton"]').click();
    cy.get('[data-testid="picInput"]').attachFile(pic);
  });
});

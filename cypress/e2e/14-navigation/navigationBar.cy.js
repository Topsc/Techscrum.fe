/// <reference types="cypress" />
import projectsData from '../../fixtures/projects.json';
import boardData from '../../fixtures/board.json';
import project from '../../fixtures/project.json';
describe('Project page', () => {
  beforeEach(() => {
    let projectList = projectsData;
    cy.intercept('GET', '**/projects', projectList).as('fetch-projects');
    cy.visit('/login');
    cy.login('coffeetsang20@gmail.com', 'wendy123');
    cy.wait('@fetch-projects');
    cy.intercept('GET', '**/board/**', boardData).as('fetch-board');
    cy.get('[data-testid="evan"]').dblclick();
    cy.wait('@fetch-board');
  });
  it('Test navigate between backlog and board', () => {
    cy.get('[data-testid="backlog-btn"]').click();
    cy.get('[data-testid="backlog-header"]').should('be.exist');
    cy.get('[data-testid="board-btn"]').click();
    cy.get('[data-testid="board-create-card"]').should('be.exist');
  });
  it('Test tasks in project', () => {
    cy.get('[data-testid="task-63565485d377d106f9a8b643"]').should('be.exist');
  });
});

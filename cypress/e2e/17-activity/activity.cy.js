import projectData from '../../fixtures/projects.json';
import activityData from '../../fixtures/activitiesV2.json';
import boardData from '../../fixtures/boardv2.json';
import boardCard from '../../fixtures/boardCard.json';

describe('Project page', () => {
  beforeEach(() => {
    let projectList = projectData;
    cy.intercept('GET', '**/projects', projectList).as('fetch-projects');
    cy.visit('/login');
    cy.login('coffeetsang20@gmail.com', 'wendy123');
    cy.wait('@fetch-projects');
    cy.intercept('GET', '**/board/**', boardData).as('fetch-board');
    cy.get('[data-testid="evan"]').dblclick();
    cy.wait('@fetch-board');
    cy.intercept('GET', '**/tasks/*', boardCard).as('fetch-task');
    cy.get('[data-testid="task-64265a2fc2c30adddb5cc239"]').click();
    cy.wait('@fetch-task');
  });
  it('Test should show activities', () => {
    cy.intercept('GET', '**/activities/**', activityData).as('fetch-activities');
    cy.get('[data-testid="show-activity-button"]').click();
    cy.wait('@fetch-activities');
    cy.get('[data-testid="activity-item-64265a2fc2c30adddb5cc248"]').should('exist');
  });
});

/// <reference types="cypress" />
import projectsData from '../../fixtures/projects.json';
import boardData from '../../fixtures/board.json';
import boardSearchResults from '../../fixtures/boardSearchResults.json';
import labelsData from '../../fixtures/labels.json';
import tasksByLabelBe from '../../fixtures/10-board-page/tasksByLabelBe.json';
import tasksByLabelBeAndFe from '../../fixtures/10-board-page/tasksByLabelBeAndFe.json';

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
    cy.intercept('GET', '**/labels', labelsData).as('fetch-labels');
    cy.visit('/login');
    cy.login('coffeetsang20@gmail.com', 'wendy123');
    cy.wait('@fetch-projects');
    cy.intercept('GET', '**/board/**', boardData).as('fetch-board');
    cy.get('[data-testid="evan"]').click();
    cy.wait('@fetch-board');
    cy.wait('@fetch-labels');
  });

  it('Test Board Page should show task', () => {
    cy.get('[data-testid="task-63565485d377d106f9a8b643"]');
    cy.get('[data-testid="task-63567b33e9bcb85c00640d0d"]');
    cy.get('[data-testid="task-63567b35e9bcb85c00640d14"]');
    cy.get('[data-testid="board-col-63565445d377d106f9a8b608"]').contains('To Do', {
      matchCase: false
    });
    cy.get('[data-testid="board-col-63565445d377d106f9a8b609"]').contains('In Progress', {
      matchCase: false
    });
    cy.get('[data-testid="board-col-63565445d377d106f9a8b60a"]').contains('Review', {
      matchCase: false
    });
    cy.get('[data-testid="board-col-63565445d377d106f9a8b60b"]').contains('Done', {
      matchCase: false
    });
  });

  it('Test Search Board page', () => {
    cy.get('[data-testid="board-search"]').click();
    cy.intercept('GET', '**/board/**', boardSearchResults).as('search-board');
    cy.get('[data-testid="board-search"]').clear().type('test');
    cy.wait('@search-board');
    cy.get('[data-testid="task-63565485d377d106f9a8b643"]');
    cy.get('[data-testid="task-63567b33e9bcb85c00640d0d"]').should('not.exist');
    cy.get('[data-testid="task-63567b35e9bcb85c00640d14"]').should('not.exist');
  });

  it('Should have label options', () => {
    cy.get('[data-testid="labelsTab"]').click();
    cy.get('[data-testid="labelOptions"]').children().should('have.length', labelsData.length);
  });

  it('Should show tasks with selected labels', () => {
    cy.intercept('GET', '**/board/**/6340129a5eb06d386302b22b', tasksByLabelBe).as(
      'get-tasksByLabelBe'
    );
    cy.intercept(
      'GET',
      '**/board/**/6340129a5eb06d386302b22b-6381d2cfa6c3f10a7e8ae07e',
      tasksByLabelBeAndFe
    ).as('get-tasksByLabelBeAndFe');
    cy.get('[data-testid="labelsTab"]').click();
    cy.get('[data-testid="label-6340129a5eb06d386302b22b"]').click();
    cy.wait('@get-tasksByLabelBe');
    // now we want to check  if all the return tasks have selected label
    cy.get('[data-testid="task-labels"]', { timeout: 8000 }).each(($parent) => {
      cy.wrap($parent).children().should('contain', 'Backend');
    });

    cy.get('[data-testid="label-6381d2cfa6c3f10a7e8ae07e"]').click();
    cy.wait('@get-tasksByLabelBeAndFe');
    cy.get('[data-testid="task-labels"]', { timeout: 8000 }).each(($parent) => {
      cy.wrap($parent).children().should('contain', 'Backend').and('contain', 'Frontend');
    });
  });
});

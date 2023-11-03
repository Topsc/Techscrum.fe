/// <reference types="cypress" />
import typesData from '../../fixtures/11-backlog-page/types.json';
import projectsData from '../../fixtures/11-backlog-page/projects.json';
import boardData from '../../fixtures/11-backlog-page/board.json';
import backlogData from '../../fixtures/11-backlog-page/backlog.json';
import backlogDataAddTask from '../../fixtures/11-backlog-page/backlogAddTask.json';
import backlogDataDeleteTask from '../../fixtures/11-backlog-page/backlogDeleteTask.json';
import backlogDataChangeTitle from '../../fixtures/11-backlog-page/backlogChangeTitle.json';
import backlogDataChangePriority from '../../fixtures/11-backlog-page/backlogChangePriority.json';
import backlogDataTaskTypeChange from '../../fixtures/11-backlog-page/backlogChangeTaskType.json';
import statusesData from '../../fixtures/statuses.json';
import labelsData from '../../fixtures/labels.json';
import usersData from '../../fixtures/usersV2.json';
import issuesByLabelBe from '../../fixtures/11-backlog-page/issuesByLabelBe.json';
import issuesByLabelBeAndFe from '../../fixtures/11-backlog-page/issuesByLabelBeAndFe.json';
import tasksByProject from '../../fixtures/11-backlog-page/tasksByProject.json';

describe('Backlog page', () => {
  beforeEach(() => {
    cy.intercept('GET', '**/types', typesData).as('fetch-types');
    cy.intercept('GET', '**/projects', projectsData).as('fetch-projects');
    cy.intercept('GET', '**/board/**', boardData).as('fetch-board');
    cy.intercept('GET', '**/projects/*/backlogs', backlogData).as('fetch-backlog');
    cy.intercept('GET', '**/labels', labelsData).as('fetch-labels');
    cy.intercept('GET', '**/labels/**', labelsData).as('fetch-labels-byProject');
    cy.intercept('GET', '**/users', usersData).as('fetch-users');
    cy.intercept('GET', '**/boards/*/statuses', statusesData).as('fetch-statuses');
    cy.intercept('GET', '**/tasks/project/**', tasksByProject).as('fetch-tasksByProject');
    cy.visit('/login');
    cy.wait('@fetch-types');
    cy.login('coffeetsang20@gmail.com', 'wendy123');
    cy.wait('@fetch-projects');
    cy.get('[data-testid="kitman-test1"]').click();
    cy.wait('@fetch-board');
    cy.wait('@fetch-users');
    cy.wait('@fetch-labels');
    cy.wait('@fetch-labels-byProject');
    cy.get('[data-testid="backlog-btn"]').click();
    cy.wait('@fetch-backlog');
    cy.wait('@fetch-statuses');
    cy.wait('@fetch-labels');
    cy.wait('@fetch-tasksByProject');
  });

  it('Test backlog page show tasks', () => {
    cy.get('[data-testid="task-63e9b7460e1460d2e3e20c52"]').contains('1302');
  });
  it('Test change task type', () => {
    cy.intercept('PUT', '**/tasks/*', backlogDataTaskTypeChange).as('change-task');
    cy.intercept('GET', '**/projects/*/backlogs', backlogDataTaskTypeChange).as(
      'fetch-backlog-task-type-updated'
    );
    cy.get('[data-testid="types-btn-63e9b7460e1460d2e3e20c52"]').click();
    cy.get('[data-testid="Tech Debt-btn-63e9b7460e1460d2e3e20c52"]').click();
    cy.wait('@change-task');
    cy.wait('@fetch-backlog-task-type-updated');
    cy.get('[data-testid="current-icon-63e9b7460e1460d2e3e20c52"]').should(
      'have.attr',
      'alt',
      'Tech Debt'
    );
  });
  it('Test create task', () => {
    cy.intercept('POST', '**/tasks', backlogDataAddTask).as('create-issue');
    cy.intercept('GET', '**/projects/*/backlogs', backlogDataAddTask).as(
      'fetch-backlog-task-added'
    );
    cy.get('[data-testid="create-issue"]').click();
    cy.get('[data-testid="create-issue-input"]').type('new issue {enter}');
    cy.wait('@create-issue');
    cy.wait('@fetch-backlog-task-added');
    cy.get('[data-testid="task-6402d9d0fe10bbef59cac8f4"]').contains('new issue');
  });

  it('Test delete task', () => {
    cy.intercept('PUT', '**/tasks/*/toggleActive', backlogDataDeleteTask).as('delete-issue');
    cy.intercept('GET', '**/tasks/project/**', tasksByProject).as('fetch-tasksByProject');
    cy.intercept('GET', '**/projects/*/backlogs', backlogDataDeleteTask).as(
      'fetch-backlog-task-deleted'
    );
    cy.get('[data-testid="task-63e9b7460e1460d2e3e20c52"]').trigger('mouseover');
    cy.get('[data-testid="hover-show-option-btn-63e9b7460e1460d2e3e20c52"]').click({ force: true });
    cy.get('[data-testid="delete-task-63e9b7460e1460d2e3e20c52"]').click({ force: true });
    cy.wait('@delete-issue');
    cy.wait('@fetch-tasksByProject');
    cy.wait('@fetch-backlog-task-deleted');
    cy.get('[data-testid="task-63e9b7460e1460d2e3e20c52"]').should('not.exist');
  });

  it('Test change title', () => {
    cy.intercept('PUT', '**/tasks/*', backlogDataChangeTitle).as('change-title');
    cy.intercept('GET', '**/projects/*/backlogs', backlogDataChangeTitle).as(
      'fetch-backlog-task-title-updated'
    );
    cy.get('[data-testid="task-63e9b7460e1460d2e3e20c52"]').trigger('mouseover');
    cy.get('[data-testid="task-edit-btn-63e9b7460e1460d2e3e20c52"]').click({ force: true });
    cy.get('[data-testid="task-title-input-63e9b7460e1460d2e3e20c52"]')
      .clear()
      .type('drink water {enter}');
    cy.wait('@change-title');
    cy.wait('@fetch-backlog-task-title-updated');
    cy.get('[data-testid="task-63e9b7460e1460d2e3e20c52"]').contains('drink water');
  });
  it('Test show priority', () => {
    cy.get('[data-testid="priority-btn-63e9b7460e1460d2e3e20c52"]').should('exist');
  });
  it('Test change priority', () => {
    cy.intercept('PUT', '**/tasks/*', backlogDataChangePriority).as('change-priority');
    cy.intercept('GET', '**/projects/*/backlogs', backlogDataChangePriority).as(
      'fetch-backlog-task-priority-updated'
    );
    cy.get('[data-testid="priority-btn-63e9b7460e1460d2e3e20c52"]').click();
    cy.get('[data-testid="priority-dropdown-btn-63e9b7460e1460d2e3e20c52-Highest"]').click();
    cy.wait('@change-priority');
    cy.wait('@fetch-backlog-task-priority-updated');
  });
  it('Should have label options', () => {
    cy.get('[data-testid="labelsTab"]').click();
    cy.get('[data-testid="labelOptions"]').children().should('have.length', labelsData.length);
  });
  it('Should show issues with selected labels', () => {
    cy.intercept(
      'GET',
      '**/projects/*/backlogs/*/*/*/6340129a5eb06d386302b22b',
      issuesByLabelBe
    ).as('get-issuesByLabelBe');
    cy.intercept(
      'GET',
      '**/projects/*/backlogs/*/*/*/6340129a5eb06d386302b22b-6381d2cfa6c3f10a7e8ae07e',
      issuesByLabelBeAndFe
    ).as('get-issuesByLabelBeAndFe');
    cy.get('[data-testid="labelsTab"]').click();
    cy.get('[data-testid="label-6340129a5eb06d386302b22b"]').click();
    cy.wait('@get-issuesByLabelBe');
    // now we want to check  if all the return tasks have selected label
    cy.get('[data-testid-count="filter-issues"]').should(
      'have.length',
      issuesByLabelBe.backlog.cards.length +
        issuesByLabelBe.sprints.reduce((acc, sprint) => acc + sprint.taskId.length, 0)
    );
    cy.get('[data-testid="label-6381d2cfa6c3f10a7e8ae07e"]').click();
    cy.wait('@get-issuesByLabelBeAndFe');
    cy.get('[data-testid-count="filter-issues"]').should(
      'have.length',
      issuesByLabelBeAndFe.backlog.cards.length +
        issuesByLabelBeAndFe.sprints.reduce((acc, sprint) => acc + sprint.taskId.length, 0)
    );
  });
});

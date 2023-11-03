/// <reference types="cypress" />
import projectsData from '../../fixtures/projects.json';
import boardData from '../../fixtures/board.json';
import dailyScrumData from '../../fixtures/dailyScrum.json';
import dailyScrumUpdateData from '../../fixtures/dailyScrumUpdate.json';

const chainStart = Symbol();
cy.all = function (...commands) {
  const _ = Cypress._;
  const chain = cy.wrap(null, { log: false });
  const stopCommand = _.find(cy.queue.commands, {
    attributes: { chainerId: chain.chainerId }
  });
  const startCommand = _.find(cy.queue.commands, {
    attributes: { chainerId: commands[0].chainerId }
  });
  const p = chain.then(() => {
    return _(commands)
      .map((cmd) => {
        return cmd[chainStart]
          ? cmd[chainStart].attributes
          : _.find(cy.queue.commands, {
              attributes: { chainerId: cmd.chainerId }
            }).attributes;
      })
      .concat(stopCommand.attributes)
      .slice(1)
      .flatMap((cmd) => {
        return cmd.prev.get('subject');
      })
      .value();
  });
  p[chainStart] = startCommand;
  return p;
};

describe('Project page', () => {
  beforeEach(() => {
    const projectList = projectsData;
    const dailyScrumList = dailyScrumData;
    cy.intercept('GET', '**/projects', projectList).as('fetch-projects');
    cy.visit('/login');
    cy.login('coffeetsang20@gmail.com', 'wendy123');
    cy.wait('@fetch-projects');
    cy.intercept('GET', '**/board/**', boardData).as('fetch-board');
    cy.get('[data-testid="evan"]').dblclick();
    cy.wait('@fetch-board');

    cy.get('[data-testid="dailyscrum-btn"]').then((items) => {
      items[0].click();
    });

    cy.intercept('GET', '**/projects/*/dailyScrums?userId=*', dailyScrumList).as(
      'fetch-dailyscrums'
    );
    cy.wait('@fetch-dailyscrums');
  });

  it(`should open dailyscrum modal`, () => {
    cy.get('[data-testid="dailyscrum-btn"]').then((items) => {
      items[0].click();
    });
    cy.get('[data-testid="dailyscrum-header"]').should('exist');
  });

  it('should display dailyscrum tickets', () => {
    const dailyScrumList = dailyScrumData;

    cy.get('[data-testid="dailyscrum-total-number-of-ticktes"]').should(
      'have.text',
      `You currently have ${dailyScrumList.length} dailyScrum(s)`
    );
    cy.get('[data-testid="dailyscrum-ticket"]').should('have.length', dailyScrumList.length);
    cy.get('[data-testid="dailyscrum-ticket-title"]').should(($titles) => {
      expect($titles).to.have.length(dailyScrumList.length);
      $titles.each((index, $title) => {
        expect($title).to.have.text(
          `${dailyScrumList[index].project.key} - ${dailyScrumList[index].title}`
        );
      });
    });

    cy.get('[data-testid="dailyscrum-ticket-progress-bar"]').should(($bars) => {
      expect($bars).to.have.length(dailyScrumList.length);
      $bars.each((index, $bar) => {
        expect($bar).to.have.value(dailyScrumList[index].progress.value);
      });
    });

    cy.get('[data-testid="dailyscrum-ticket-progress-description"]').should(($descs) => {
      expect($descs).to.have.length(dailyScrumList.length);
      $descs.each((index, $desc) => {
        expect($desc).to.have.text(
          `${dailyScrumList[index].progress.value}% - ${new Date(
            dailyScrumList[index].progress.timeStamp
          ).toLocaleString()}`
        );
      });
    });

    cy.get('[data-testid^="dailyscrum-ticket-binary-input-group-"]').should(($groups) => {
      const numOfGroupsShown = dailyScrumList.reduce((accu, { isCanFinish }) => {
        if (!isCanFinish) {
          return (accu += 2);
        }

        return ++accu;
      }, 0);
      expect($groups).to.have.length(numOfGroupsShown);

      $groups.each((index, $group) => {
        const $radioInputs = $group.querySelectorAll('input');
        expect($radioInputs).to.have.length(2);

        // the data-testid of radio input group is in format: dailyscrum-ticket-binary-input-group-${groupType}-${dailyScrumId}
        const groupType = $group.dataset.testid.split('-')[5];
        const dailyScrumId = $group.dataset.testid.split('-')[6];
        let selectedValue;
        if (groupType === 'isCanFinish') {
          selectedValue = dailyScrumList.find((dailyScrum) => {
            return dailyScrum.id === dailyScrumId;
          }).isCanFinish;
        } else {
          selectedValue = dailyScrumList.find((dailyScrum) => {
            return dailyScrum.id === dailyScrumId;
          }).isNeedSupport;
        }

        $radioInputs.forEach(($radioInput) => {
          const id = $radioInput.id;
          // the id of radio input is in format: isCanFinish-${dailyScrumId}-yes/no
          const answer = id.split('-')[2];

          if (selectedValue === (answer === 'yes' ? true : false)) {
            expect($radioInput).to.have.attr('checked');
          } else {
            expect($radioInput).to.not.have.attr('checked');
          }
        });
      });
    });

    // MUST use .then to get the value of the element
    cy.get('[data-testid="dailyscrum-ticket-support-type-radio-input-group"]').should(($groups) => {
      const numOfGroupsShown = dailyScrumList.filter((dailyScrum) => {
        return dailyScrum.isNeedSupport;
      }).length;
      expect($groups).to.have.length(numOfGroupsShown);
      $groups.each((index, $group) => {
        const $radioInputs = $group.querySelectorAll('input');
        expect($radioInputs).to.have.length(4);
        $radioInputs.forEach(($radioInput) => {
          const id = $radioInput.id;
          // the id of radio input is in format: supportType-${dailyScrumId}-${index}
          const dailyScrumId = id.split('-')[1];

          const selectedSupportType = dailyScrumList.find((dailyScrum) => {
            return dailyScrum.id === dailyScrumId;
          }).supportType;

          // value of radio input is string, so need to convert to number
          if (+$radioInput.value === +selectedSupportType) {
            expect($radioInput).to.have.attr('checked');
          } else {
            expect($radioInput).to.not.have.attr('checked');
          }
        });
      });
    });

    cy.get('[data-testid="dailyscrum-ticket-other-support-desc"]').should(($descs) => {
      const numOfOtherSupportDescsShown = dailyScrumList.filter((dailyScrum) => {
        return dailyScrum.otherSupportDesc;
      }).length;
      expect($descs).to.have.length(numOfOtherSupportDescsShown);
      $descs.each((index, $desc) => {
        expect($desc).to.have.text(
          dailyScrumList[index].otherSupportDesc ? dailyScrumList[index].otherSupportDesc : ''
        );
      });
    });
  });

  it('should update dailyscrum ticket', async () => {
    const dailyScrumList = dailyScrumData;
    const dailyScrumUpdate = dailyScrumUpdateData;

    cy.intercept('GET', '**/projects/*/dailyScrums?userId=*', dailyScrumUpdate).as(
      'fetch-dailyscrums-update'
    );

    cy.get('[data-testid="dailyscrum-ticket-progress-bar"]')
      .eq(0)
      .should('have.value', dailyScrumList[0].progress.value);

    cy.intercept('PATCH', '**/projects/*/dailyScrums/*', dailyScrumUpdate[0]).as(
      'update-dailyscrum'
    );
    cy.get('[data-testid="dailyscrum-submit"]').click(); // this seems to be the only way to trigger the update request
    cy.wait('@update-dailyscrum'); // wait for the update request to finish

    cy.wait(7000);

    cy.get('[data-testid="dailyscrum-btn"]').then((items) => {
      items[0].click();
    });

    cy.wait('@fetch-dailyscrums-update');

    cy.get('[data-testid="dailyscrum-ticket-progress-bar"]')
      .eq(0)
      .should('have.value', dailyScrumUpdate[0].progress.value);
  });

  it('should close dailyscrum page', () => {
    cy.get('[data-testid="dailyscrum-btn"]').then((items) => {
      items[0].click();
    });
    cy.get('[data-testid="dailyscrum-close"]').click();
    cy.get('[data-testid="dailyscrum-header"]').should('not.exist');
  });
});

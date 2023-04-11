/// <reference types="cypress" />
describe('Weather App', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3001'); // Update the URL to match your local development server
  });

  it('should display weather information after submitting location', () => {
    cy.intercept('POST', 'http://localhost:3000/dev/weather').as('getWeather');
    cy.get('[data-cy="location-input"]').type('New York, USA');
    cy.get('[data-cy="search-button"]').click();
    cy.wait('@getWeather').then(({ response }) => {
      cy.get('[data-cy="search-results"]').should('be.visible');
      cy.get('[data-cy="search-results-weather"]').should('be.visible');
      cy.get('[data-cy="search-results-weather"] img').should('have.attr', 'src', response.body.image);
      cy.get('[data-cy="search-results-weather"] div').contains('Location: New York');
      cy.get('[data-cy="search-results-weather"] div').contains('Weather: ' + response.body.weather);
    });
  });

  it('should display error message for invalid location', () => {
    cy.get('[data-cy="search-button"]').click();
    cy.request({
      method: 'POST',
      url: 'http://localhost:3000/dev/weather',
      body: { location: '' },
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      failOnStatusCode: false
    }).then(({ status, body: { error } }) => {
      expect(status).to.eq(400)
      cy.get('[data-cy="search-results"]').should('not.exist');
      cy.get('[data-cy="search-results-error"]').contains(error);
    });
  });
});

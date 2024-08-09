import { getAllColors } from "../../src/utils";

describe("Create new room and creating a new player in the room", () => {
  before(() => {
    cy.visit("/");
  });

  it("should click on a create private room button and create a new player", () => {
    cy.get('[data-testid="create-private-room"]').click();
    cy.url().should("include", "http://localhost:5173/rooms/");
    cy.get('[data-testid="players-form"]').should("be.visible");
    cy.get('[data-testid="nick-input"]').type("test_player");
    cy.get('label[data-testid="character-select"]').then((labels) => {
      // Iterate through each radio button to find which one is selected
      const radios = labels.siblings("input[type='radio']");
      const selectedRadio = radios.filter(":checked");

      cy.wait(1500);

      // Check if exactly one radio button is selected
      cy.wrap(selectedRadio).should("have.length", 1);

      const randomIndex = Math.floor(Math.random() * labels.length);
      // Get the random label element
      const randomLabel = labels.eq(randomIndex);
      // Selecting new character
      cy.wrap(randomLabel).click();

      const newCharacterColor = randomLabel
        .siblings("input[type='radio']")
        .val();

      cy.wait(1500);

      expect(getAllColors()).to.include(newCharacterColor);
    });
    cy.get('[data-testid="enter-game-btn"]').click();
    cy.get('[data-testid="players-form"]').should("not.exist");
  });
});

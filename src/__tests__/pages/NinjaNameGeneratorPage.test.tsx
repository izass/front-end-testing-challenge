import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { NinjaNameGeneratorPage } from "../../pages/NinjaNameGeneratorPage";

const setup = () => ({
  user: userEvent.setup(),
  ...render(<NinjaNameGeneratorPage />),
});

describe("NinjaNameGeneratorPage", () => {
  describe("When component is rendered", () => {
    it("Renders form empty", () => {
      setup();
      const form = screen.getByRole("form");

      expect(form).toHaveFormValues({
        cardNumber: "",
        cardVerificationValue: "",
        cardExpirationDate: "",
      });
    });

    it("Generate button starts disabled", () => {
      setup();
      const generateButton = screen.getByRole("button");

      expect(generateButton).toBeDisabled();
    });

    describe("And we had generated a ninja name", () => {
      describe("And we click the back button", () => {
        it("it should show the empty form", async () => {
          const { user } = setup();

          const cardNumberInput = screen.getByTitle("Card Number");
          const verificationValueInput = screen.getByTitle(
            "Card Verification Value"
          );
          const expirationDateInput = screen.getByRole("textbox", {
            name: "Card Expiration Date",
          });

          await user.type(expirationDateInput, "12/2025");
          await user.type(cardNumberInput, "1234567890123456");
          await user.type(verificationValueInput, "123");

          const generateButton = await screen.findByRole("button", {
            name: "Gerar",
          });

          await user.click(generateButton);
          const backButton = await screen.findByRole("button", {
            name: "Voltar",
          });
          await user.click(backButton);

          const form = screen.getByRole("form");

          expect(form).toHaveFormValues({
            cardNumber: "",
            cardVerificationValue: "",
            cardExpirationDate: "",
          });
        });
      });
    });
  });
  describe("When fields are filled", () => {
    describe("And form is valid", () => {
      it("enables generate button", async () => {
        const { user } = setup();

        const cardNumberInput = screen.getByTitle("Card Number");
        const verificationValueInput = screen.getByTitle(
          "Card Verification Value"
        );
        const expirationDateInput = screen.getByRole("textbox", {
          name: "Card Expiration Date",
        });

        await user.type(expirationDateInput, "12/2025");
        await user.type(cardNumberInput, "1234567890123456");
        await user.type(verificationValueInput, "123");

        const generateButton = await screen.findByRole("button", {
          name: "Gerar",
        });

        expect(generateButton).toBeEnabled();
      });
      describe("And generate button is clicked", () => {
        it("Shows ninja name", async () => {
          const { user } = setup();

          const cardNumberInput = screen.getByTitle("Card Number");
          const verificationValueInput = screen.getByTitle(
            "Card Verification Value"
          );
          const expirationDateInput = screen.getByRole("textbox", {
            name: "Card Expiration Date",
          });

          await user.type(expirationDateInput, "12/2025");
          await user.type(cardNumberInput, "1234567890123456");
          await user.type(verificationValueInput, "123");

          const generateButton = await screen.findByRole("button", {
            name: "Gerar",
          });

          await user.click(generateButton);

          const ninjaName = await screen.findByTestId("ninja-name");

          expect(ninjaName).toBeInTheDocument();
        });
      });
    });
    describe("And form is invalid", () => {
      describe("to Card number", () => {
        it("renders generate button disabled", async () => {
          const { user } = setup();

          const cardNumberInput = screen.getByTitle("Card Number");
          const verificationValueInput = screen.getByTitle(
            "Card Verification Value"
          );
          const expirationDateInput = screen.getByRole("textbox", {
            name: "Card Expiration Date",
          });

          await user.type(expirationDateInput, "12/2025");
          await user.type(verificationValueInput, "123");

          await user.type(cardNumberInput, "1");

          const generateButton = await screen.findByRole("button", {
            name: "Gerar",
          });

          expect(generateButton).toBeDisabled();
        });
      });

      describe("to Card Verification Value", () => {
        it("renders generate button disabled", async () => {
          const { user } = setup();

          const cardNumberInput = screen.getByTitle("Card Number");
          const verificationValueInput = screen.getByTitle(
            "Card Verification Value"
          );
          const expirationDateInput = screen.getByRole("textbox", {
            name: "Card Expiration Date",
          });

          await user.type(cardNumberInput, "1234567890123456");
          await user.type(expirationDateInput, "12/2025");

          await user.type(verificationValueInput, "0");

          const generateButton = await screen.findByRole("button", {
            name: "Gerar",
          });

          expect(generateButton).toBeDisabled();
        });
      });

      describe("to Card Expiration Date", () => {
        it("renders generate button disabled", async () => {
          const { user } = setup();

          const cardNumberInput = screen.getByTitle("Card Number");
          const verificationValueInput = screen.getByTitle(
            "Card Verification Value"
          );
          const expirationDateInput = screen.getByRole("textbox", {
            name: "Card Expiration Date",
          });

          await user.type(cardNumberInput, "1234567890123456");
          await user.type(expirationDateInput, "12/2020");
          await user.type(verificationValueInput, "123");

          const generateButton = await screen.findByRole("button", {
            name: "Gerar",
          });

          expect(generateButton).toBeDisabled();
        });
      });
    });
  });
});

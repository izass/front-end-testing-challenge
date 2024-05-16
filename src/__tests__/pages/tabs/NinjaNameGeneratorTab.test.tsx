import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { makeNinjaNameGeneratorTab } from "../../../pages/NinjaNamePage/tabs/NinjaNameGeneratorTab";
import { UseGenerateNinjaName } from "../../../hooks/useGenerateNinjaName";

const setup = (useGenerateNinjaName: UseGenerateNinjaName) => {
  const NinjaNameGeneratorTab = makeNinjaNameGeneratorTab({
    useGenerateNinjaName,
  });

  return {
    ...render(<NinjaNameGeneratorTab />),
  };
};

const useGenerateNinjaNameProperties = {
  isGenerating: false,
  ninjaName: undefined,
  error: false,
  reset: () => {},
  generateNinjaName: async () => {},
};

describe("NinjaNameGeneratorTab", () => {
  describe("When component renders", () => {
    describe("And isGenerating is true", () => {
      it("Should render a loading", () => {
        const mockUseGenerateNinjaName: UseGenerateNinjaName = () => ({
          ...useGenerateNinjaNameProperties,
          isGenerating: true,
        });

        setup(mockUseGenerateNinjaName);

        expect(screen.getByLabelText("loading")).toBeInTheDocument();
      });
    });

    describe("And isGenerating is false", () => {
      describe("And error is truthy", () => {
        it("Should render an error message", () => {
          const mockUseGenerateNinjaName: UseGenerateNinjaName = () => ({
            ...useGenerateNinjaNameProperties,
            error: true,
          });

          setup(mockUseGenerateNinjaName);

          expect(
            screen.getByTestId("ninja-name-generation-error")
          ).toBeInTheDocument();
        });
      });

      describe("And error is falsy", () => {
        describe("And there is a ninja name", () => {
          it("Should render a ninja name", () => {
            const mockUseGenerateNinjaName: UseGenerateNinjaName = () => ({
              ...useGenerateNinjaNameProperties,
              ninjaName: "hatake kakashi",
            });

            setup(mockUseGenerateNinjaName);

            expect(screen.getByTestId("ninja-name")).toBeInTheDocument();
          });
        });
        describe("And there is not a ninja name", () => {
          it("Should render a form", () => {
            const mockUseGenerateNinjaName: UseGenerateNinjaName = () => ({
              ...useGenerateNinjaNameProperties,
            });

            setup(mockUseGenerateNinjaName);

            expect(screen.getByRole("form")).toBeInTheDocument();
          });
        });
      });
    });
  });
});

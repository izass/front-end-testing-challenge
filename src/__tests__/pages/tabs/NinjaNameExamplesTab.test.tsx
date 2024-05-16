import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { UseNinjaNames } from "../../../hooks/useNinjaNames";
import { makeNinjaNameExamplesTab } from "../../../pages/NinjaNamePage/tabs/NinjaNameExamplesTab";
import { act } from "react";

const setup = (useNinjaNames: UseNinjaNames) => {
  const NinjaNameExamplesTab = makeNinjaNameExamplesTab({
    useNinjaNames,
  });

  return {
    user: userEvent.setup({
      advanceTimers: (ms) => vi.advanceTimersByTime(ms),
    }),
    ...render(<NinjaNameExamplesTab />),
  };
};

const useNinjaNamesProperties = {
  ninjaNames: undefined,
  isFetching: false,
  refetch: () => {},
  error: false,
};

describe("NinjaNameExamplesTab", () => {
  beforeEach(() => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
  });
  afterEach(() => {
    vi.useRealTimers();
  });

  describe("When component renders", () => {
    it("Should render auto reload check box unchecked", () => {
      const mockUseNinjaNames: UseNinjaNames = () => ({
        ...useNinjaNamesProperties,
      });

      setup(mockUseNinjaNames);

      const checkbox = screen.getByRole("checkbox", {
        name: /Auto-recarregar/i,
      });

      expect(checkbox).not.toBeChecked();
    });

    describe("And auto reload check box is clicked", () => {
      it("Should activate auto reload", async () => {
        const refetchFunc = vi.fn();

        const mockUseNinjaNames: UseNinjaNames = () => ({
          ...useNinjaNamesProperties,
          refetch: refetchFunc,
        });

        const { user } = setup(mockUseNinjaNames);

        const refetchCheckbox = screen.getByRole("checkbox", {
          name: /Auto-recarregar/i,
        });

        await user.click(refetchCheckbox);

        act(() => {
          vi.advanceTimersByTime(4000);
        });

        expect(refetchFunc).toHaveBeenCalledTimes(0);

        act(() => {
          vi.advanceTimersByTime(6000);
        });

        expect(refetchFunc).toHaveBeenCalledTimes(2);
        expect(refetchCheckbox).toBeChecked();
      });
    });

    describe("And auto reload check box unchecked", () => {
      it("Should deactivate auto reload", async () => {
        const refetchFunc = vi.fn();

        const mockUseNinjaNames: UseNinjaNames = () => ({
          ...useNinjaNamesProperties,
          refetch: refetchFunc,
        });

        const { user } = setup(mockUseNinjaNames);

        const refetchCheckbox = screen.getByRole("checkbox", {
          name: /Auto-recarregar/i,
        });

        await user.click(refetchCheckbox);

        act(() => {
          vi.advanceTimersByTime(4000);
        });

        await user.click(refetchCheckbox);


        act(() => {
          vi.advanceTimersByTime(6000);
        });

        expect(refetchFunc).toHaveBeenCalledTimes(0);
        expect(refetchCheckbox).not.toBeChecked();
      });
    });

    describe("And refresh button is clicked", () => {
      it("Should call refetch function", async () => {
        const refetchFunc = vi.fn();

        const mockUseNinjaNames: UseNinjaNames = () => ({
          ...useNinjaNamesProperties,
          refetch: refetchFunc,
          ninjaNames: [
            { id: "1", name: "D uzumaki naruto" },
            { id: "2", name: "A haruno sakura" },
            { id: "3", name: "C uchiha sasuke" },
            { id: "4", name: "B hatake kakashi" },
          ],
        });

        const { user } = setup(mockUseNinjaNames);

        const refreshButton = screen.getByRole("button", {
          name: /recarregar/i,
        });

        await user.click(refreshButton);

        expect(refetchFunc).toHaveBeenCalledTimes(1);
      });
    });

    describe("And isFetching is true", () => {
      it("Should render a loading", () => {
        const mockUseNinjaNames: UseNinjaNames = () => ({
          ...useNinjaNamesProperties,
          isFetching: true,
        });

        setup(mockUseNinjaNames);

        expect(screen.getByLabelText("loading")).toBeInTheDocument();
      });
    });

    describe("And isFetching is false", () => {
      describe("And error is truthy", () => {
        it("Should render an error message", () => {
          const mockUseNinjaNames: UseNinjaNames = () => ({
            ...useNinjaNamesProperties,
            error: true,
          });

          setup(mockUseNinjaNames);

          expect(
            screen.getByTestId("ninja-names-list-error")
          ).toBeInTheDocument();
        });
      });
      describe("And error is falsy", () => {
        describe("And there is no ninja names", () => {
          it("Should render a empty container message", () => {
            const mockUseNinjaNames: UseNinjaNames = () => ({
              ...useNinjaNamesProperties,
            });

            setup(mockUseNinjaNames);

            expect(screen.getByText(/no data/i)).toBeInTheDocument();
          });
        });
        describe("And has ninja names", () => {
          it("Should render a list with ninja names ordered by name", () => {
            const mockUseNinjaNames: UseNinjaNames = () => ({
              ...useNinjaNamesProperties,
              ninjaNames: [
                { id: "1", name: "D uzumaki naruto" },
                { id: "2", name: "A haruno sakura" },
                { id: "3", name: "C uchiha sasuke" },
                { id: "4", name: "B hatake kakashi" },
              ],
            });

            setup(mockUseNinjaNames);

            const names = screen.queryAllByTestId(/ninja-name-example/);

            expect(screen.getByRole("list")).toBeInTheDocument();
            expect(names.length).toBe(4);
            expect(names[0].textContent).toBe("A haruno sakura");
            expect(names[1].textContent).toBe("B hatake kakashi");
            expect(names[2].textContent).toBe("C uchiha sasuke");
            expect(names[3].textContent).toBe("D uzumaki naruto");
          });
        });
      });
    });
  });
});

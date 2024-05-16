import { renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { useCardForm } from "../../hooks/useCardForm";
import { act } from "react";
import dayjs from "dayjs";

describe("useCardForm", () => {
  describe("When hook is called", () => {
    it("Returns form values empty", () => {
      const { result } = renderHook(() => useCardForm());

      expect(result.current.cardExpirationDate).toBe(null);
      expect(result.current.cardNumber).toBe("");
      expect(result.current.cardNumber).toBe("");
    });

    describe("When setting card number", () => {
      it("Should filter out all non-digit character", () => {
        const { result } = renderHook(() => useCardForm());

        act(() => {
          result.current.setCardNumber("123abdc456");
        });

        expect(result.current.cardNumber).toBe("123456");
      });

      it("Should limit card number size to 16 characters", () => {
        const { result } = renderHook(() => useCardForm());

        act(() => {
          result.current.setCardNumber("12345678901234567890");
        });

        expect(result.current.cardNumber.length).toBe(16);
      });
    });

    describe("When setting card verification value", () => {
      it("Should filter out all non-digit character", () => {
        const { result } = renderHook(() => useCardForm());

        act(() => {
          result.current.setCardVerificationValue("ab1");
        });

        expect(result.current.cardVerificationValue).toBe("1");
      });

      it("Should limit card verification value size to 3 characters", () => {
        const { result } = renderHook(() => useCardForm());

        act(() => {
          result.current.setCardVerificationValue("12345678901234567890");
        });

        expect(result.current.cardVerificationValue.length).toBe(3);
      });
    });

    describe("When all form values are filled", () => {
      describe("And the values are valid", () => {
        it("Should return isValid as true", () => {
          const { result } = renderHook(() => useCardForm());

          const expirationDateInFuture = dayjs(Date.now()).add(1, "month");

          act(() => {
            result.current.setCardNumber("1234567890123456");
            result.current.setCardVerificationValue("123");
            result.current.setCardExpirationDate(expirationDateInFuture);
          });

          expect(result.current.isValid).toBeTruthy();
        });
      });

      describe("And the values are invalid", () => {
        it("Should return isValid as false", () => {
          const { result } = renderHook(() => useCardForm());

          const expirationDateInPast = dayjs(Date.now()).subtract(1, "month");

          act(() => {
            result.current.setCardNumber("1234567890123456");
            result.current.setCardVerificationValue("123");
            result.current.setCardExpirationDate(expirationDateInPast);
          });

          expect(result.current.isValid).toBeFalsy();
        });
      });
    });
  });
});

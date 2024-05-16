import { type FC } from "react";

import { Button, DatePicker, Flex, Form, Input } from "antd";

import { type CardFormValues, useCardForm } from "../hooks/useCardForm";

export type CardFormProps = {
  onSubmit: (values: CardFormValues) => void;
};

export const CardForm: FC<CardFormProps> = ({ onSubmit }) => {
  const {
    isValid,
    cardNumber,
    setCardNumber,
    cardVerificationValue,
    setCardVerificationValue,
    cardExpirationDate,
    setCardExpirationDate,
  } = useCardForm();

  return (
    <Form
      name="ninjaNameForm"
      autoComplete="off"
      style={{ width: "420px" }}
      aria-label="form"
    >
      <Form.Item>
        <Input
          name="cardNumber"
          title="Card Number"
          value={cardNumber}
          onInput={(e) => setCardNumber(e.currentTarget.value)}
          maxLength={16}
          placeholder="Os 16 números do cartão da sua mãe"
          size="large"
        />
      </Form.Item>
      <Form.Item>
        <Input
          title="Card Verification Value"
          value={cardVerificationValue}
          onInput={(e) => setCardVerificationValue(e.currentTarget.value)}
          maxLength={3}
          name="cardVerificationValue"
          placeholder="Os 3 números do verso"
          size="large"
        />
      </Form.Item>
      <Form.Item>
        <DatePicker
          value={cardExpirationDate}
          aria-label="Card Expiration Date"
          onChange={(date) => setCardExpirationDate(date)}
          picker="month"
          size="large"
          format="MM/YYYY"
          name="cardExpirationDate"
          style={{ width: "100%" }}
          placeholder="A data de validade"
        />
      </Form.Item>
      <Form.Item>
        <Flex justify="center">
          <Button
            size="large"
            type="primary"
            disabled={!isValid}
            onClick={() =>
              onSubmit({
                cardNumber,
                cardVerificationValue,
                cardExpirationDate: cardExpirationDate!,
              })
            }
          >
            Gerar
          </Button>
        </Flex>
      </Form.Item>
    </Form>
  );
};

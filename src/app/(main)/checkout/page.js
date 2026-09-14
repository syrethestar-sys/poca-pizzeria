import { CheckoutForm } from "./_features/checkout-form";

export const metadata = { title: "Checkout" };

export default function CheckoutPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 pt-12 pb-10 sm:px-6">
      <CheckoutForm />
    </div>
  );
}

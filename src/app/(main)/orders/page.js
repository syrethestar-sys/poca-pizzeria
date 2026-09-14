import { OrderList } from "./order-list";

export const metadata = { title: "Your orders" };

export default function OrdersPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 pt-12 pb-10 sm:px-6">
      <OrderList />
    </div>
  );
}

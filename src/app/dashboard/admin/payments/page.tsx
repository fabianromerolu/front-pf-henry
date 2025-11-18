// src/app/dashboard/admin/payments/page.tsx
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AdminTransactionsList from "@/components/dashboards/admin/payments/AdminTransactionsList";
import AdminPayoutsList from "@/components/dashboards/admin/payments/AdminPayoutsList";

export default function AdminPaymentsPage() {
  return (
    <section className="space-y-4">
      <Tabs defaultValue="transactions" className="w-full">
        <TabsList className="bg-black/30 border border-white/10 rounded-2xl p-1">
          <TabsTrigger
            value="transactions"
            className="flex-1 data-[state=active]:bg-white data-[state=active]:text-[var(--color-dark-blue)] data-[state=active]:shadow data-[state=active]:border-white/70 text-xs sm:text-sm rounded-xl"
          >
            Transacciones
          </TabsTrigger>
          <TabsTrigger
            value="payouts"
            className="flex-1 data-[state=active]:bg-white data-[state=active]:text-[var(--color-dark-blue)] data-[state=active]:shadow data-[state=active]:border-white/70 text-xs sm:text-sm rounded-xl"
          >
            Retiros
          </TabsTrigger>
        </TabsList>

        <TabsContent value="transactions" className="mt-4">
          <AdminTransactionsList />
        </TabsContent>

        <TabsContent value="payouts" className="mt-4">
          <AdminPayoutsList />
        </TabsContent>
      </Tabs>
    </section>
  );
}

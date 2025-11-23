import { useQuery } from "@tanstack/react-query";
import { Package, Users, Wallet, Receipt } from "lucide-react";
import { StatCard } from "@/components/stat-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { formatCurrency } from "@/lib/currency";
import type { GlobalReport } from "@shared/schema";

export default function Dashboard() {
  const { data: report, isLoading } = useQuery<GlobalReport>({
    queryKey: ["/api/reports/global"],
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Tableau de bord</h1>
          <p className="text-muted-foreground mt-2">
            Vue d'ensemble de votre projet de construction
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <Skeleton className="h-32 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold" data-testid="heading-dashboard">
          Tableau de bord
        </h1>
        <p className="text-muted-foreground mt-2">
          Vue d'ensemble de votre projet de construction
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Matériaux"
          value={`${formatCurrency(report?.totalMaterialsSpent || 0)} Ar`}
          icon={Package}
          testId="stat-materials"
        />
        <StatCard
          title="Salaires maçons"
          value={`${formatCurrency(report?.totalMasonsPaid || 0)} Ar`}
          icon={Users}
          testId="stat-masons"
        />
        <StatCard
          title="Avances"
          value={`${formatCurrency(report?.totalAdvances || 0)} Ar`}
          icon={Wallet}
          testId="stat-advances"
        />
        <StatCard
          title="Repas"
          value={`${formatCurrency(report?.totalMeals || 0)} Ar`}
          icon={Receipt}
          testId="stat-meals"
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Dépenses totales</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-sm font-medium text-muted-foreground mb-2">
              Total construction
            </p>
            <p className="text-4xl font-bold text-primary" data-testid="total-expenses">
              {formatCurrency(report?.totalExpenses || 0)} Ar
            </p>
          </div>
          <div className="border-t pt-6 mt-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">
                  Répartition des dépenses
                </p>
                <div className="space-y-1">
                  <div className="flex justify-between">
                    <span className="text-sm">Matériaux:</span>
                    <span className="text-sm font-medium">
                      {formatCurrency(report?.totalMaterialsSpent || 0)} Ar
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Main d'œuvre:</span>
                    <span className="text-sm font-medium">
                      {formatCurrency(
                        (report?.totalMasonsPaid || 0) +
                        (report?.totalAdvances || 0) +
                        (report?.totalMeals || 0)
                      )} Ar
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

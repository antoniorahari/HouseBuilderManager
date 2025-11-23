import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AddMasonDialog } from "@/components/add-mason-dialog";
import { formatCurrency } from "@/lib/currency";
import type { Mason, WorkDay, Advance, Meal } from "@shared/schema";
import { Users, ArrowRight } from "lucide-react";
import { Link } from "wouter";

export default function Masons() {
  const { data: masons = [], isLoading: isLoadingMasons } = useQuery<Mason[]>({
    queryKey: ["/api/masons"],
  });

  const { data: workDays = [] } = useQuery<WorkDay[]>({
    queryKey: ["/api/work-days"],
  });

  const { data: advances = [] } = useQuery<Advance[]>({
    queryKey: ["/api/advances"],
  });

  const { data: meals = [] } = useQuery<Meal[]>({
    queryKey: ["/api/meals"],
  });

  const getMasonStats = (masonId: string) => {
    const masonWorkDays = workDays.filter((w) => w.masonId === masonId);
    const mason = masons.find((m) => m.id === masonId);
    const dailyRate = mason ? Number(mason.dailyRate) : 0;

    const totalHours = masonWorkDays.reduce(
      (sum, w) => sum + Number(w.hours),
      0
    );
    const totalWorked = (totalHours / 8) * dailyRate;

    const totalAdvances = advances
      .filter((a) => a.masonId === masonId)
      .reduce((sum, a) => sum + Number(a.amount), 0);

    const totalMeals = meals
      .filter((m) => m.masonId === masonId)
      .reduce((sum, m) => sum + Number(m.amount), 0);

    const balance = totalWorked - totalAdvances - totalMeals;

    return {
      totalWorked,
      totalAdvances,
      totalMeals,
      balance,
      totalHours,
    };
  };

  if (isLoadingMasons) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Maçons</h1>
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-56" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap justify-between items-center gap-3">
        <div>
          <h1 className="text-3xl font-bold" data-testid="heading-masons">
            Maçons
          </h1>
          <p className="text-muted-foreground mt-2">
            Gérer les maçons et leur temps de travail
          </p>
        </div>
        <AddMasonDialog />
      </div>

      {masons.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Users className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-lg font-medium text-muted-foreground mb-2">
              Aucun maçon
            </p>
            <p className="text-sm text-muted-foreground text-center">
              Commencez par ajouter vos premiers maçons
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {masons.map((mason) => {
            const stats = getMasonStats(mason.id);
            return (
              <Card key={mason.id} data-testid={`card-mason-${mason.id}`}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">{mason.name}</CardTitle>
                    {stats.balance > 0 && (
                      <Badge variant="secondary">À payer</Badge>
                    )}
                    {stats.balance === 0 && workDays.some(w => w.masonId === mason.id) && (
                      <Badge>Réglé</Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">
                        Salaire journalier
                      </span>
                      <span className="font-medium">
                        {formatCurrency(Number(mason.dailyRate))} Ar
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">
                        Heures travaillées
                      </span>
                      <span className="font-medium">{stats.totalHours}h</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Salaire dû</span>
                      <span className="font-semibold text-primary">
                        {formatCurrency(stats.totalWorked)} Ar
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">
                        Solde restant
                      </span>
                      <span
                        className={`font-bold ${
                          stats.balance > 0
                            ? "text-destructive"
                            : "text-green-600"
                        }`}
                      >
                        {formatCurrency(stats.balance)} Ar
                      </span>
                    </div>
                  </div>
                  <Link href={`/masons/${mason.id}`}>
                    <Button
                      variant="outline"
                      className="w-full"
                      data-testid={`button-view-mason-${mason.id}`}
                    >
                      Voir détails
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}

import { useQuery } from "@tanstack/react-query";
import { useRoute } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AddWorkDayDialog } from "@/components/add-work-day-dialog";
import { AddAdvanceDialog } from "@/components/add-advance-dialog";
import { AddMealDialog } from "@/components/add-meal-dialog";
import { formatCurrency } from "@/lib/currency";
import type { Mason, WorkDay, Advance, Meal } from "@shared/schema";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { ArrowLeft, Calendar, Wallet, UtensilsCrossed } from "lucide-react";
import { Link } from "wouter";

export default function MasonDetail() {
  const [, params] = useRoute("/masons/:id");
  const masonId = params?.id || "";

  const { data: masons = [] } = useQuery<Mason[]>({
    queryKey: ["/api/masons"],
  });

  const { data: workDays = [], isLoading: isLoadingWork } = useQuery<WorkDay[]>({
    queryKey: ["/api/work-days"],
  });

  const { data: advances = [], isLoading: isLoadingAdvances } = useQuery<Advance[]>({
    queryKey: ["/api/advances"],
  });

  const { data: meals = [], isLoading: isLoadingMeals } = useQuery<Meal[]>({
    queryKey: ["/api/meals"],
  });

  const mason = masons.find((m) => m.id === masonId);
  const masonWorkDays = workDays.filter((w) => w.masonId === masonId);
  const masonAdvances = advances.filter((a) => a.masonId === masonId);
  const masonMeals = meals.filter((m) => m.masonId === masonId);

  if (!mason) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-64" />
      </div>
    );
  }

  const dailyRate = Number(mason.dailyRate);
  const totalHours = masonWorkDays.reduce(
    (sum, w) => sum + Number(w.hours),
    0
  );
  const totalWorked = (totalHours / 8) * dailyRate;

  const totalAdvances = masonAdvances.reduce(
    (sum, a) => sum + Number(a.amount),
    0
  );

  const totalMeals = masonMeals.reduce(
    (sum, m) => sum + Number(m.amount),
    0
  );

  const totalPaid = totalAdvances + totalMeals;
  const balance = totalWorked - totalPaid;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/masons">
          <Button variant="outline" size="icon" data-testid="button-back">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div className="flex-1">
          <h1 className="text-3xl font-bold" data-testid="heading-mason-name">
            {mason.name}
          </h1>
          <p className="text-muted-foreground mt-1">
            Salaire journalier: {formatCurrency(dailyRate)} Ar
          </p>
        </div>
        {balance > 0 && <Badge variant="secondary">À payer</Badge>}
        {balance === 0 && masonWorkDays.length > 0 && <Badge>Réglé</Badge>}
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">
                Salaire dû
              </p>
              <p className="text-2xl font-bold text-primary" data-testid="total-worked">
                {formatCurrency(totalWorked)} Ar
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">
                Avances
              </p>
              <p className="text-2xl font-bold" data-testid="total-advances">
                {formatCurrency(totalAdvances)} Ar
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">
                Repas
              </p>
              <p className="text-2xl font-bold" data-testid="total-meals">
                {formatCurrency(totalMeals)} Ar
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">
                Solde
              </p>
              <p
                className={`text-2xl font-bold ${
                  balance > 0 ? "text-destructive" : "text-green-600"
                }`}
                data-testid="balance"
              >
                {formatCurrency(balance)} Ar
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="work" className="space-y-4">
        <TabsList>
          <TabsTrigger value="work" data-testid="tab-work">
            <Calendar className="h-4 w-4 mr-2" />
            Journées
          </TabsTrigger>
          <TabsTrigger value="advances" data-testid="tab-advances">
            <Wallet className="h-4 w-4 mr-2" />
            Avances
          </TabsTrigger>
          <TabsTrigger value="meals" data-testid="tab-meals">
            <UtensilsCrossed className="h-4 w-4 mr-2" />
            Repas
          </TabsTrigger>
        </TabsList>

        <TabsContent value="work" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Journées de travail</h2>
            <AddWorkDayDialog masonId={masonId} />
          </div>
          <Card>
            <CardContent className="p-6">
              {isLoadingWork ? (
                <Skeleton className="h-48" />
              ) : masonWorkDays.length === 0 ? (
                <div className="text-center py-12">
                  <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-lg font-medium text-muted-foreground mb-2">
                    Aucune journée enregistrée
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Commencez par ajouter les journées de travail
                  </p>
                </div>
              ) : (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead className="text-right">Heures</TableHead>
                        <TableHead className="text-right">Montant</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {masonWorkDays
                        .sort(
                          (a, b) =>
                            new Date(b.date).getTime() -
                            new Date(a.date).getTime()
                        )
                        .map((workDay) => {
                          const hours = Number(workDay.hours);
                          const amount = (hours / 8) * dailyRate;
                          return (
                            <TableRow
                              key={workDay.id}
                              data-testid={`row-work-${workDay.id}`}
                            >
                              <TableCell>
                                {format(new Date(workDay.date), "dd MMM yyyy", {
                                  locale: fr,
                                })}
                              </TableCell>
                              <TableCell className="text-right">
                                {hours}h
                              </TableCell>
                              <TableCell className="text-right font-semibold">
                                {formatCurrency(amount)} Ar
                              </TableCell>
                            </TableRow>
                          );
                        })}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="advances" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Avances</h2>
            <AddAdvanceDialog masonId={masonId} />
          </div>
          <Card>
            <CardContent className="p-6">
              {isLoadingAdvances ? (
                <Skeleton className="h-48" />
              ) : masonAdvances.length === 0 ? (
                <div className="text-center py-12">
                  <Wallet className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-lg font-medium text-muted-foreground mb-2">
                    Aucune avance
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Aucune avance n'a été enregistrée pour ce maçon
                  </p>
                </div>
              ) : (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead className="text-right">Montant</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {masonAdvances
                        .sort(
                          (a, b) =>
                            new Date(b.date).getTime() -
                            new Date(a.date).getTime()
                        )
                        .map((advance) => (
                          <TableRow
                            key={advance.id}
                            data-testid={`row-advance-${advance.id}`}
                          >
                            <TableCell>
                              {format(new Date(advance.date), "dd MMM yyyy", {
                                locale: fr,
                              })}
                            </TableCell>
                            <TableCell className="text-right font-semibold">
                              {formatCurrency(Number(advance.amount))} Ar
                            </TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="meals" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Repas</h2>
            <AddMealDialog masonId={masonId} />
          </div>
          <Card>
            <CardContent className="p-6">
              {isLoadingMeals ? (
                <Skeleton className="h-48" />
              ) : masonMeals.length === 0 ? (
                <div className="text-center py-12">
                  <UtensilsCrossed className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-lg font-medium text-muted-foreground mb-2">
                    Aucun repas
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Aucun repas n'a été enregistré pour ce maçon
                  </p>
                </div>
              ) : (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead className="text-right">Montant</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {masonMeals
                        .sort(
                          (a, b) =>
                            new Date(b.date).getTime() -
                            new Date(a.date).getTime()
                        )
                        .map((meal) => (
                          <TableRow
                            key={meal.id}
                            data-testid={`row-meal-${meal.id}`}
                          >
                            <TableCell>
                              {format(new Date(meal.date), "dd MMM yyyy", {
                                locale: fr,
                              })}
                            </TableCell>
                            <TableCell className="text-right font-semibold">
                              {formatCurrency(Number(meal.amount))} Ar
                            </TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

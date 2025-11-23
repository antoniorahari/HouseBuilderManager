import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { AddPurchaseDialog } from "@/components/add-purchase-dialog";
import { formatCurrency } from "@/lib/currency";
import type { Purchase, Material } from "@shared/schema";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { History } from "lucide-react";

export default function Purchases() {
  const { data: purchases = [], isLoading: isLoadingPurchases } = useQuery<Purchase[]>({
    queryKey: ["/api/purchases"],
  });

  const { data: materials = [] } = useQuery<Material[]>({
    queryKey: ["/api/materials"],
  });

  const getMaterialName = (materialId: string) => {
    return materials.find((m) => m.id === materialId)?.name || "Inconnu";
  };

  const totalSpent = purchases.reduce(
    (sum, p) => sum + Number(p.totalPrice),
    0
  );

  if (isLoadingPurchases) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Historique des achats</h1>
          <Skeleton className="h-10 w-40" />
        </div>
        <Skeleton className="h-64" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap justify-between items-center gap-3">
        <div>
          <h1 className="text-3xl font-bold" data-testid="heading-purchases">
            Historique des achats
          </h1>
          <p className="text-muted-foreground mt-2">
            Tous les achats de matériaux enregistrés
          </p>
        </div>
        <AddPurchaseDialog />
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="mb-6">
            <p className="text-sm font-medium text-muted-foreground mb-1">
              Total des achats
            </p>
            <p className="text-2xl font-bold" data-testid="total-purchases">
              {formatCurrency(totalSpent)} Ar
            </p>
          </div>

          {purchases.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <History className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-lg font-medium text-muted-foreground mb-2">
                Aucun achat enregistré
              </p>
              <p className="text-sm text-muted-foreground text-center">
                Commencez par enregistrer vos premiers achats de matériaux
              </p>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Matériau</TableHead>
                    <TableHead className="text-right">Quantité</TableHead>
                    <TableHead className="text-right">Prix total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {purchases
                    .sort(
                      (a, b) =>
                        new Date(b.date).getTime() - new Date(a.date).getTime()
                    )
                    .map((purchase) => (
                      <TableRow
                        key={purchase.id}
                        data-testid={`row-purchase-${purchase.id}`}
                      >
                        <TableCell>
                          {format(new Date(purchase.date), "dd MMM yyyy", {
                            locale: fr,
                          })}
                        </TableCell>
                        <TableCell className="font-medium">
                          {getMaterialName(purchase.materialId)}
                        </TableCell>
                        <TableCell className="text-right">
                          {Number(purchase.quantity)}
                        </TableCell>
                        <TableCell className="text-right font-semibold">
                          {formatCurrency(Number(purchase.totalPrice))} Ar
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { AddMaterialDialog } from "@/components/add-material-dialog";
import { formatCurrency } from "@/lib/currency";
import type { Material, Purchase } from "@shared/schema";
import { Package } from "lucide-react";

export default function Materials() {
  const { data: materials = [], isLoading: isLoadingMaterials } = useQuery<Material[]>({
    queryKey: ["/api/materials"],
  });

  const { data: purchases = [] } = useQuery<Purchase[]>({
    queryKey: ["/api/purchases"],
  });

  const getMaterialTotal = (materialId: string) => {
    return purchases
      .filter((p) => p.materialId === materialId)
      .reduce((sum, p) => sum + Number(p.totalPrice), 0);
  };

  if (isLoadingMaterials) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Matériaux</h1>
          <Skeleton className="h-10 w-40" />
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap justify-between items-center gap-3">
        <div>
          <h1 className="text-3xl font-bold" data-testid="heading-materials">
            Matériaux
          </h1>
          <p className="text-muted-foreground mt-2">
            Gérer les matériaux de construction
          </p>
        </div>
        <AddMaterialDialog />
      </div>

      {materials.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Package className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-lg font-medium text-muted-foreground mb-2">
              Aucun matériau
            </p>
            <p className="text-sm text-muted-foreground text-center">
              Commencez par ajouter vos premiers matériaux de construction
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {materials.map((material) => (
            <Card key={material.id} data-testid={`card-material-${material.id}`}>
              <CardHeader>
                <CardTitle className="text-lg">{material.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">
                      Total dépensé
                    </span>
                    <span className="text-lg font-bold text-primary">
                      {formatCurrency(getMaterialTotal(material.id))} Ar
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">
                      Nombre d'achats
                    </span>
                    <span className="text-sm font-medium">
                      {purchases.filter((p) => p.materialId === material.id).length}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

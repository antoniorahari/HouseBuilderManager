import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertWorkDaySchema, type InsertWorkDay } from "@shared/schema";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface AddWorkDayDialogProps {
  masonId: string;
}

export function AddWorkDayDialog({ masonId }: AddWorkDayDialogProps) {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();

  const form = useForm<InsertWorkDay>({
    resolver: zodResolver(insertWorkDaySchema),
    defaultValues: {
      masonId,
      date: new Date(),
      hours: 0,
    },
  });

  const createWorkDay = useMutation({
    mutationFn: (data: InsertWorkDay) =>
      apiRequest("POST", "/api/work-days", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/masons", masonId] });
      queryClient.invalidateQueries({ queryKey: ["/api/work-days"] });
      queryClient.invalidateQueries({ queryKey: ["/api/reports/global"] });
      toast({
        title: "Journée ajoutée",
        description: "La journée de travail a été enregistrée",
      });
      form.reset({ masonId, date: new Date(), hours: 0 });
      setOpen(false);
    },
    onError: () => {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible d'enregistrer la journée",
      });
    },
  });

  const onSubmit = (data: InsertWorkDay) => {
    createWorkDay.mutate(data);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" data-testid="button-add-work-day">
          <Plus className="h-4 w-4 mr-2" />
          Ajouter journée
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Ajouter une journée de travail</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date</FormLabel>
                  <FormControl>
                    <Input
                      type="date"
                      data-testid="input-work-date"
                      value={
                        field.value instanceof Date
                          ? field.value.toISOString().split("T")[0]
                          : ""
                      }
                      onChange={(e) => field.onChange(new Date(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="hours"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Heures travaillées</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.5"
                      placeholder="Ex: 8"
                      data-testid="input-hours"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                data-testid="button-cancel"
              >
                Annuler
              </Button>
              <Button
                type="submit"
                disabled={createWorkDay.isPending}
                data-testid="button-submit"
              >
                {createWorkDay.isPending ? "Enregistrement..." : "Enregistrer"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

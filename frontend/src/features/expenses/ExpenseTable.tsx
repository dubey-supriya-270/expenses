import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ChevronsLeft, ChevronsRight } from "lucide-react";
import {
  useApproveExpenseMutation,
  useGetExpensesQuery,
} from "../../api/expenseApi";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { selectPage, selectPageSize } from "./selectors";
import { setPage } from "./expensesSlice";
import { fmtDate } from "@/lib/format";

export default function ExpenseTable() {
  const page = useAppSelector(selectPage);
  const pageSize = useAppSelector(selectPageSize);
  const dispatch = useAppDispatch();

  const { data, isFetching } = useGetExpensesQuery({ page, pageSize });
  const total = data?.total ?? 0;
  const last = Math.max(1, Math.ceil(total / pageSize));
  const role = useAppSelector((s) => s.auth.role); // 'admin' | 'employee' | null
  const [approveExpense] = useApproveExpenseMutation();

  return (
    <div className="space-y-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Category</TableHead>
            <TableHead className="text-right">Amount</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {data?.items?.map((e) => {
            const status = e.approved ? "Approved" : "Pending";
            return (
              <TableRow key={e.id}>
                <TableCell>{fmtDate(e.date)}</TableCell>
                <TableCell>{e.description}</TableCell>
                <TableCell>{e.category}</TableCell>
                <TableCell className="text-right">
                  {e.amount.toFixed(2)}
                </TableCell>
                <TableCell>
                  <span
                    className={
                      e.approved ? "text-green-600" : "text-yellow-600"
                    }
                  >
                    {status}
                  </span>
                </TableCell>

                {/* Admin-only Approve button */}
                {role === "admin" && (
                  <TableCell className="text-right">
                    {!e.approved && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => approveExpense({ id: e.id })}
                      >
                        Approve
                      </Button>
                    )}
                  </TableCell>
                )}
              </TableRow>
            );
          })}

          {isFetching && (
            <TableRow>
              <TableCell colSpan={4} className="text-center">
                Loading…
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {/* Pager */}
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          size="icon"
          disabled={page <= 1}
          onClick={() => dispatch(setPage(page - 1))}
        >
          <ChevronsLeft className="h-4 w-4" />
        </Button>

        <span className="text-sm">
          Page <b>{page}</b> / {last}
        </span>

        <Button
          variant="ghost"
          size="icon"
          disabled={page >= last}
          onClick={() => dispatch(setPage(page + 1))}
        >
          <ChevronsRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

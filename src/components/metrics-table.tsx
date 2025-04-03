"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

export default function MetricsTable({ data }) {
  // Find the best model for each metric
  const bestMape = Math.min(...data.map((item) => item.mape))
  const bestRmse = Math.min(...data.map((item) => item.rmse))
  const bestMae = Math.min(...data.map((item) => item.mae))

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Model</TableHead>
            <TableHead className="text-right">MAPE (%)</TableHead>
            <TableHead className="text-right">RMSE</TableHead>
            <TableHead className="text-right">MAE</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((item) => (
            <TableRow key={item.model}>
              <TableCell className="font-medium">{item.model}</TableCell>
              <TableCell className="text-right">
                {item.mape.toFixed(2)}
                {item.mape === bestMape && (
                  <Badge variant="outline" className="ml-2 bg-green-100 text-green-800">
                    Best
                  </Badge>
                )}
              </TableCell>
              <TableCell className="text-right">
                {item.rmse.toFixed(2)}
                {item.rmse === bestRmse && (
                  <Badge variant="outline" className="ml-2 bg-green-100 text-green-800">
                    Best
                  </Badge>
                )}
              </TableCell>
              <TableCell className="text-right">
                {item.mae.toFixed(2)}
                {item.mae === bestMae && (
                  <Badge variant="outline" className="ml-2 bg-green-100 text-green-800">
                    Best
                  </Badge>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}


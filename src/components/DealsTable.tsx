import React from "react";
import DealRow from "./DealRow";
import { IDeal } from "../types";

interface DealsTableProps {
  deals: IDeal[];
}

const DealsTable: React.FC<DealsTableProps> = ({ deals }) => {
  return (
    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Название</th>
          <th>Бюджет</th>
        </tr>
      </thead>
      <tbody>
        {deals.map((deal) => (
          <DealRow key={deal.id} deal={deal} />
        ))}
      </tbody>
    </table>
  );
};

export default DealsTable;

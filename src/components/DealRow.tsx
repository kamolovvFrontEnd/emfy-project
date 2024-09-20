import React, { useState } from "react";
import axios from "axios";
import { IDeal } from "../types";

interface DealRowProps {
  deal: IDeal;
}

const DealRow: React.FC<DealRowProps> = ({ deal }) => {
  const [expanded, setExpanded] = useState<boolean>(false);
  const [loadingDetails, setLoadingDetails] = useState<boolean>(false);
  const [details, setDetails] = useState<IDeal | null>(null);

  const accessToken = "your_access_token"; 

  const toggleDetails = async () => {
    if (expanded) {
      setExpanded(false);
    } else {
      setLoadingDetails(true);
      try {
        const response = await axios.get(
          `https://kmlvbilol.amocrm.ru/api/v4/leads/${deal.id}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        setDetails(response.data);
        setLoadingDetails(false);
        setExpanded(true);
      } catch (error) {
        console.error("Ошибка при получении деталей сделки", error);
        setLoadingDetails(false);
      }
    }
  };

  return (
    <>
      <tr onClick={toggleDetails}>
        <td>{deal.id}</td>
        <td>{deal.name}</td>
        <td>{deal.price}</td>
      </tr>
      {expanded && (
        <tr>
          <td colSpan={3}>
            {loadingDetails ? (
              <p>Загрузка деталей...</p>
            ) : (
              details && (
                <div>
                  <p>ID: {details.id}</p>
                  <p>Название: {details.name}</p>
                  {details._embedded?.tasks &&
                  details._embedded.tasks.length > 0 ? (
                    <>
                      <p>
                        Дата задачи:{" "}
                        {new Date(
                          details._embedded.tasks[0].complete_till
                        ).toLocaleDateString()}
                      </p>
                      <TaskStatus
                        taskDate={details._embedded.tasks[0].complete_till}
                      />
                    </>
                  ) : (
                    <p>Нет задач</p>
                  )}
                </div>
              )
            )}
          </td>
        </tr>
      )}
    </>
  );
};

interface TaskStatusProps {
  taskDate: string;
}

const TaskStatus: React.FC<TaskStatusProps> = ({ taskDate }) => {
  const today = new Date();
  const taskDateObj = new Date(taskDate);

  let statusColor = "gray"; 
  if (taskDateObj) {
    if (taskDateObj < today) {
      statusColor = "red"; 
    } else if (taskDateObj.toDateString() === today.toDateString()) {
      statusColor = "green"; 
    } else {
      statusColor = "yellow"; 
    }
  }

  return (
    <div>
      <p>Статус задачи:</p>
      <svg width="20" height="20">
        <circle cx="10" cy="10" r="10" fill={statusColor} />
      </svg>
    </div>
  );
};

export default DealRow;

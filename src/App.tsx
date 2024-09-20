import React, { useState, useEffect } from "react";
import axios from "axios";
import DealsTable from "./components/DealsTable";
import { IDeal } from "./types";

const App: React.FC = () => {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [deals, setDeals] = useState<IDeal[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const clientId = "your_client_id";
  const clientSecret = "your_client_secret_id";
  const redirectUri = "your_redirect_uri";
  const code = "your_authorization_code";

  const getAccessToken = async () => {
    try {
      const response = await axios.post(
        `https://kmlvbilol.amocrm.ru/oauth2/access_token`,
        {
          client_id: clientId,
          client_secret: clientSecret,
          grant_type: "authorization_code",
          code: code,
          redirect_uri: redirectUri,
        }
      );
      const { access_token } = response.data;
      setAccessToken(access_token);
    } catch (error) {
      console.error("Ошибка при получении access_token", error);
    }
  };

  const fetchDeals = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `https://kmlvbilol.amocrm.ru/api/v4/leads`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      setDeals(response.data._embedded.leads);
      setLoading(false);
    } catch (error) {
      console.error("Ошибка при получении сделок", error);
      setLoading(false);
    }
  };

  const createNewDeal = async () => {
    const newDealData: Partial<IDeal> = {
      name: "Новая сделка",
      price: 5000,
    };

    try {
      const response = await axios.post(
        "https://kmlvbilol.amocrm.ru/api/v4/leads",
        newDealData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      console.log("Новая сделка создана:", response.data);
      fetchDeals();
    } catch (error) {
      console.error("Ошибка при создании сделки", error);
    }
  };

  useEffect(() => {
    if (!accessToken) {
      getAccessToken();
    } else {
      fetchDeals();
    }
  }, [accessToken]);

  return (
    <div className="App">
      <h1>Список сделок из amoCRM</h1>
      {loading ? <p>Загрузка...</p> : <DealsTable deals={deals} />}
      <button onClick={createNewDeal}>Создать новую сделку</button>
    </div>
  );
};

export default App;

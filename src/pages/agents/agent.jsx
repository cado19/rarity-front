import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { baseURL } from "../../constants/url";
import axios from "axios";
import Loading from "../../components/PageContent/Loading";

export default function Agent() {
  const { id } = useParams();
  const [agent, setAgent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const agentURL = baseURL + `/api/agents/read_single.php?id=${id}`;

  const getAgent = async () => {
    try {
      await axios.get(agentURL).then((response) => {
        console.log(response);
        setAgent(response.data.agent);
        setLoading(false);
      });
    } catch (error) {
      const errorMessage = error.message;
      setError(errorMessage);
    }
  };

  useEffect(() => {
    getAgent();
  }, []);

  if (error) {
    return (
      <div className="bg-white px-4 pb-4 rounded border-gray-200 flex-1 shadow-md">
        {error}
      </div>
    );
  }
  if (loading) {
    return (
      <div className="bg-white px-4 pb-4 rounded border-gray-200 flex-1 shadow-md">
        <Loading />
      </div>
    );
  }
  return (
    <div className=" rounded overflow-hidden shadow-lg flex flex-row bg-white">
      <div className="flex items-center justify-center">
        <div className="px-6 py-4">
          <div className="font-bold text-xl mb-2">Agent Details</div>{" "}
          <p className="text-gray-700 text-base">
            {" "}
            <span className="font-bold"> Name:</span> {agent.name}{" "}
          </p>{" "}
          <p className="text-gray-700 text-base">
            {" "}
            <span className="font-bold">Email:</span> {agent.email}.{" "}
          </p>{" "}
          <p className="text-gray-700 text-base">
            {" "}
            <span className="font-bold">Tel:</span> {agent.phone_no}.{" "}
          </p>{" "}
          <p className="text-gray-700 text-base">
            {" "}
            <span className="font-bold">Country:</span> {agent.country}.{" "}
          </p>{" "}
          <p className="text-gray-700 text-base">
            {" "}
            <span className="font-bold">Role:</span> {agent.role}.{" "}
          </p>{" "}

        </div>
      </div>
    </div>
  );
}

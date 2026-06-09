import React, { useEffect } from "react";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { get_vehicle_base, get_vehicle_requirements } from "../../../api/fetch";
import StyledButton from "../../../components/styled/StyledButton";
import Loading from "../../../components/PageContent/Loading";
import BasicTable from "../../../components/utility/basicTable";
import { requirementColumns } from "../../../components/utility/tableColumns";

export default function AllRequirements() {
  const navigate = useNavigate();

  const { vehicle_id } = useParams();

  // state
  const [requirements, setRequirements] = useState([]);
  const [vehicle, setVehicle] = useState({});
  const [columnFilters, setColumnFilters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchRequirements = async () => {
    try {
      const response = await get_vehicle_requirements(vehicle_id);
      console.log("Requirement response: ", response);
      setRequirements(response.data.requirements);
    } catch (error) {
      setError("Requirements Error: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchVehicle = async () => {
    try {
      const response = await get_vehicle_base(vehicle_id);
      console.log("Vehicle response: ", response);
      setVehicle(response.data.base);
    } catch (error) {
      setError("Vehicle Error: " + error.message);
    }
  };

  useEffect(() => {
    fetchVehicle();
    fetchRequirements();
  }, []);

  if (error) {
    return (
      <div className="bg-white px-4 pb-4 rounded border-gray-200 flex-1 shadow-md">
        {error}
      </div>
    );
  }
  if (loading) {
    return <Loading />;
  }

  return (
    <div className="bg-white px-4 pb-4 rounded border-gray-200 flex-1 shadow-md mt-2 mx-3">
      <h1 className="text-3xl font-bold text-end text-yellow-600 tracking-wide mb-4 mt-2">
        {vehicle.make} {vehicle.model} {vehicle.number_plate} Requirements
      </h1>
      <StyledButton
        to={{ pathname: `/vehicle/${vehicle_id}/requirements/new` }}
        label="Add"
      />

      <BasicTable
        columns={requirementColumns}
        columnFilters={columnFilters}
        setColumnFilters={setColumnFilters}
        data={requirements}
      />
    </div>
  );
}

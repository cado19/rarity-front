import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import Loading from "../../../components/PageContent/Loading";
import { save_requirement } from "../../../api/post";
import Swal from "sweetalert2";
import RequirementForm from "../../../components/forms/RequirementForm";

export default function NewRequirement() {
  const navigate = useNavigate();
  const { vehicle_id } = useParams();

  const handleSubmit = async (data) => {
    // console.log("Form data: ", data);
    try {
      const payload = {...data, vehicle_id};
      // console.log("Form data: ", payload);
      const res = await save_requirement(payload);
      console.log("Response: ", res);
      if (res.data.status == "Success") {
        Swal.fire({
          title: "Requirement Created",
          text: res.data.message || "The requirement was created successfully.",
          icon: "success",
          confirmButtonText: "OK",
        }).then(() => {
          // redirect after user closes the popup
          navigate("vehicle/${vehicle_id}/requirements");
        });
      } else {
        Swal.fire({
          title: "Error Creating Requirement",
          text: res.data.message || "Something went wrong.",
          icon: "error",
          confirmButtonText: "Close",
        });
        console.error("Error creating work order: " + res.data.message);
      }
    } catch (error) {
      console.error("Error creating work order:", error);
      Swal.fire({
        title: "Network Error",
        text: "Something went wrong while creating the work order.",
        icon: "error",
        confirmButtonText: "Close",
      });
    }
  };


  return <div><RequirementForm onSubmit={handleSubmit} mode="create" /></div>;
}

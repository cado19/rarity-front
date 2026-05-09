import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import AgentNav from "../../components/navs/agentnav";
import Loading from "../../components/PageContent/Loading";
import AgentForm from "../../components/forms/AgentForm";
import { fetchAgentDetails, fetchAccountRoles } from "../../api/fetch";
import { updateAgent } from "../../api/put"; // you'll need an update endpoint

export default function EditAgent() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [inputs, setInputs] = useState({
    name: "",
    email: "",
    phone_number: "",
    country: "",
    role_ids: [],
  });
  const [phone, setPhone] = useState("");
  const [roles, setRoles] = useState([]);
  const [errors, setErrors] = useState({});
  const [disabled, setDisabled] = useState(false);
  const [loading, setLoading] = useState(true);

  // Fetch agent details
  useEffect(() => {
    const getData = async () => {
      try {
        // Fetch all roles
        const rolesRes = await fetchAccountRoles();
        if (rolesRes.status === "Success") {
          setRoles(rolesRes.roles); // all available roles
        }

        // Fetch agent details
        const agentRes = await fetchAgentDetails(id);
        if (agentRes.status === "Success") {
          const agent = agentRes.agent;
          setInputs({
            name: agent.name,
            email: agent.email,
            phone_number: agent.phone_no,
            country: agent.country,
            role_ids: agent.roles.map((r) => r.id), // pre‑check assigned roles
          });
          setPhone(agent.phone_no);
        } else {
          Swal.fire({ icon: "error", title: "Error", text: agentRes.message });
        }
      } catch (err) {
        Swal.fire({ icon: "error", title: "Network Error", text: err.message });
      } finally {
        setLoading(false);
      }
    };
    getData();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInputs({ ...inputs, [name]: value });
  };

  const validate = (data) => {
    const errors = {};
    if (!data.name) errors.name = "Name is required";
    if (!data.email) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(data.email)) {
      errors.email = "Email is invalid";
    }
    if (!data.role_ids || data.role_ids.length === 0) {
      errors.role_ids = "At least one role is required";
    }
    if (!data.country) errors.country = "Country is required";
    setErrors(errors);
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setDisabled(true);
    const validationErrors = validate(inputs);
    if (Object.keys(validationErrors).length > 0) {
      setDisabled(false);
      return;
    }
    try {
      const response = await updateAgent(id, inputs);
      if (response.status === "Success") {
        navigate(`/agent/${id}`, { state: { message: "Agent Updated" } });
      } else {
        Swal.fire({ icon: "error", title: "Oops...", text: response.message });
      }
    } catch (err) {
      Swal.fire({ icon: "error", title: "Network Error", text: err.message });
      console.error(err.message);
    } finally {
      setDisabled(false);
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="bg-white px-4 pb-4 rounded shadow-md mt-2 mx-3">
      <AgentNav />
      <h1 className="text-3xl font-bold text-end text-yellow-600 tracking-wide mb-4 mt-2">
        Edit Agent
      </h1>
      <AgentForm
        inputs={inputs}
        setInputs={setInputs}
        errors={errors}
        phone={phone}
        setPhone={setPhone}
        roles={roles}
        disabled={disabled}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
      />
    </div>
  );
}

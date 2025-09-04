import axios from "axios";

const baseUrl = import.meta.env.VITE_BASE_URL;

// VEHICLES POST
export const update_vehicle_extras = async (extras) => {
  const extrasUrl = baseUrl + `/api/fleet/update_extras.php`;
  const response = await axios.post(extrasUrl, extras);
  return response;
};

export const update_vehicle_basics = async (basics) => {
  const extrasUrl = baseUrl + `/api/fleet/update_base.php`;
  const response = await axios.post(extrasUrl, basics);
  return response;
};

export const save_issue = async (issues) => {
  const issuesUrl = baseUrl + `/api/fleet/create_issue.php`;
  const response = await axios.post(issuesUrl, issues);
  return response;
};

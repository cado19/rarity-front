import React from "react";

export default function FormattedDate({ date }) {
  const new_date = new Date(date).toString();

  return <>{new_date}</>;
}

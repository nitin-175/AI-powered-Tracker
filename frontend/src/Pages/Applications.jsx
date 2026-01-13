import React, { useState } from "react";
import JobTable from "../Components/JobTable";
import { jobs as jobsData } from "../data/jobs";
import JobFilters from "../Components/JobFilters";

export default function Applications() {
	const [search, setSearch] = useState("");
	const [status, setStatus] = useState("");

	const filteredJobs = jobsData.filter((job) => {
		const matchesSearch =
			job.company.toLowerCase().includes(search.toLowerCase()) ||
			job.role.toLowerCase().includes(search.toLowerCase());

		const matchesStatus = status === "" || job.status === status;

		return matchesSearch && matchesStatus;
	});

	return (
		<>
			<div className="mt-18">
				<JobFilters
					search={search}
					setSearch={setSearch}
					status={status}
					setStatus={setStatus}
				/>

				<JobTable jobs={filteredJobs} />
			</div>
		</>
	);
}

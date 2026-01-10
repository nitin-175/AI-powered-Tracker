
import React from 'react'
import JobTable from '../Components/JobTable'
import { jobs as jobsData } from "../data/jobs";

export default function Applications() {
  

  return (

    <div>
        <JobTable jobs={jobsData} />
    </div>
  )
}

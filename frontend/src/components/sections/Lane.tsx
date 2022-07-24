import React, { useContext, useState, useEffect } from "react"
import { useParams } from 'react-router-dom';
import { AuthContext } from "../../../src/App"
import client from "../../lib/api/client"
import { Section } from "../../interfaces"

const Lane: any = ({ section }: { section: Section }) => {
  return(
    <>
      <p>{section.title}</p>
    </>
  )
}

export default Lane

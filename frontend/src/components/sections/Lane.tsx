import React, { useContext, useState, useEffect } from "react"
import { useParams } from 'react-router-dom';
import { AuthContext } from "../../../src/App"
import client from "../../lib/api/client"
import { Section } from "../../interfaces"
import { styled } from '@mui/material/styles';

import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';


import Grid from '@mui/material/Grid';
import Input from '@mui/material/Input';

const Lane: any = ({ section }: { section: Section }) => {
  const SectionCard = styled(Card) ({
    height: "100%",
    width: "300px",
  })

  const submitTitleUpdate = (id: Number) => {
    const params = {
      title: "test",
    }

    client.patch(`sections/${id}`, { section: params }).then((res) => {
    })
  }

  return(
    <>
      <Grid item>
        <SectionCard>
          <CardContent>
            <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
              <Input
                defaultValue={section.title ? section.title : "No title"}
              />
            </Typography>
            <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
              + タスクを追加
            </Typography>
          </CardContent>
        </SectionCard>
      </Grid>
    </>
  )
}

export default Lane

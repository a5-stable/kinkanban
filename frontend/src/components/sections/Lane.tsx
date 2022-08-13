import React, { useContext, useState, useEffect } from "react"
import { useParams } from 'react-router-dom';
import { AuthContext } from "../../../src/App"
import client from "../../lib/api/client"
import { Section } from "../../interfaces"
import { styled } from '@mui/material/styles';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';


import Grid from '@mui/material/Grid';

const Lane: any = ({ section }: { section: Section }) => {
  const SectionCard = styled(Card) ({
    height: "100%",
    width: "300px",
  })

  return(
    <>
      <Grid item>
        <SectionCard>
          <CardContent>
            <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
              {section.title}
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

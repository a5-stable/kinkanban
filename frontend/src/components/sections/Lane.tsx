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
  })

  return(
    <>
      <div>
        <Grid item>
          <SectionCard>
            <CardContent>
              <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                Word of the Day
              </Typography>
              <Typography variant="h5" component="div">
                {section.title}
              </Typography>
              <Typography sx={{ mb: 1.5 }} color="text.secondary">
                adjective
              </Typography>
              <Typography variant="body2">
                well meaning and kindly.
                <br />
                {'"a benevolent smile"'}
              </Typography>
            </CardContent>
            <CardActions>
              <Button size="small">Learn More</Button>
            </CardActions>
          </SectionCard>
        </Grid>
      </div>
    </>
  )
}

export default Lane

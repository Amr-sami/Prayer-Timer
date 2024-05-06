import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import fajrPrayerImage from '../assets/fajr-prayer.png'; 

export default function MediaCard({prayerName , prayerTime, image}) {
  return (
    <Card sx={{ Width: "14vw" }}>
      <CardMedia
        sx={{ height: 140 }}
        image = {image}
        // image={fajrPrayerImage} // Using the imported image
        title="green iguana"
      />
      <CardContent>
        <h1>
           {prayerName}
        </h1>
        <Typography variant="h2" color="text.secondary">
          {prayerTime}
        </Typography>
      </CardContent>
    </Card>
  );
}

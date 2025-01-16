// src/components/tracking/TripHistory.jsx
import React, { useState, useEffect } from 'react';
import { 
  Card, 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableRow,
  TablePagination,
  Typography,
  Chip
} from '@mui/material';
import { format } from 'date-fns';
import api from '../../utils/api';

const TripHistory = () => {
  const [trips, setTrips] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const res = await api.get('/trips/history');
        setTrips(res.data);
      } catch (error) {
        console.error('Error fetching trips:', error);
      }
    };
    fetchTrips();
  }, []);

  const getModeColor = (mode) => {
    const colors = {
      car: 'error',
      bus: 'primary',
      train: 'primary',
      bike: 'success',
      walk: 'success'
    };
    return colors[mode] || 'default';
  };

  return (
    <Card>
      <Typography variant="h6" padding={2}>
        Trip History
      </Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Date</TableCell>
            <TableCell>Mode</TableCell>
            <TableCell>Distance</TableCell>
            <TableCell>Duration</TableCell>
            <TableCell>Carbon Footprint</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {trips
            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            .map((trip) => (
              <TableRow key={trip.id}>
                <TableCell>
                  {format(new Date(trip.date), 'MMM dd, yyyy')}
                </TableCell>
                <TableCell>
                  <Chip 
                    label={trip.mode} 
                    color={getModeColor(trip.mode)}
                    size="small"
                  />
                </TableCell>
                <TableCell>{trip.distance} km</TableCell>
                <TableCell>{trip.duration} min</TableCell>
                <TableCell>{trip.carbonFootprint} kg CO2</TableCell>
              </TableRow>
          ))}
        </TableBody>
      </Table>
      <TablePagination
        component="div"
        count={trips.length}
        page={page}
        onPageChange={(e, newPage) => setPage(newPage)}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={(e) => {
          setRowsPerPage(parseInt(e.target.value, 10));
          setPage(0);
        }}
      />
    </Card>
  );
};

export default TripHistory;
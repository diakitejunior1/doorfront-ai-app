import * as React from 'react';
import Map, { Source, Layer, MapLayerMouseEvent } from 'react-map-gl';
import { Box, Container, Grid, Typography, } from '@mui/material'
import Item from '@mui/material/Grid'
import CircleIcon from '@mui/icons-material/Circle';
import type { Feature, GeoJsonProperties, Point, Geometry } from 'geojson'
import * as turf from '@turf/turf';
import nearestPoint from '@turf/nearest-point';
import { useExplorationStore } from '../../global/explorationState';
import { useNavigate } from 'react-router-dom';
import type { LayerProps } from 'react-map-gl';
import { features, turfFeatureCollection, queriedFeatures, defaultHoverInfo, defaultMessage, llb, legend, typographySX, gridSX } from './data';
import {contestNeighborhoods} from './contest';
import Button from '@mui/material/Button/Button';
import { updateContestScore, getContestScore } from '../../apis/user';
import { getActiveContest } from '../../apis/contest';
import { ContestAreaInfo } from '../Contest';
import { readLocal,LocalStorageKeyType } from '../../utils/localStorage';


export default function ContestMap() {

  const contestNotes = [
    "Neighborhood Name:","Area Score:","Percent Owned:","Current Owener:","Ownership Bonus:"
  ]

  const { updateGoogleMapConfig } = useExplorationStore();
  const navigate = useNavigate();

  const [subtitle, setSubtitle] = React.useState<string>(defaultMessage)
  const [mapClicked, setMapClicked] = React.useState<boolean>(false);
  const [hoverInfo, setHoverInfo] = React.useState<features>(defaultHoverInfo)
  const turfStreetPoints: turfFeatureCollection[] = React.useMemo(() => pointsToFeatureCollection(), [])
  const [contestScore,setContestScore] =React.useState(0)
   React.useEffect(()=>{
    async function retrieveContestScore(){
      console.log(readLocal("id"))
      const res = await getContestScore({id:readLocal("id") as string})
      console.log(res)
      setContestScore(res.data)
    }
    retrieveContestScore()
  },[])
  const neighborhoodCoordinates = React.useMemo(() => {
    if (hoverInfo.name !== "") {
      return contestNeighborhoods.features.filter(loc => loc.properties.name === hoverInfo.name)[0].geometry.coordinates
    }
    else {
      return [[[0]]]
    }
  }, [hoverInfo.name])

  const [layerStyle, setLayerStyle] = React.useState<LayerProps>({
    id: 'border',
    type: 'line',
    paint: { "line-color": "#000000", "line-width": 0 },
    beforeId: "settlement-subdivision-label"
  })

  const [drawnFeatures, setDrawnFeatures] = React.useState<Feature<Geometry, GeoJsonProperties>>({
    type: 'Feature',
    geometry: {
      type: 'Polygon',
      coordinates: []
    },
    properties: {
      stroke: "#000000",
      strokeWidth: '1',
      strokeOpacity: "1"
    }
  })



  React.useEffect(() => {
    if (hoverInfo.name !== "") {
      setDrawnFeatures({
        ...drawnFeatures,
        //@ts-ignore
        geometry: { type: 'Polygon', coordinates: neighborhoodCoordinates }
      })
      setSubtitle(hoverInfo.progress + ' commercial doorfronts (' + hoverInfo.percentage + '%) marked in ' + hoverInfo.name + '.')

      //@ts-ignore
      setLayerStyle({ ...layerStyle, paint: { "line-color": "#000000", "line-width": 1.5 } })
    }
    else if (subtitle !== defaultMessage) setSubtitle(defaultMessage)
  }, [hoverInfo.name])


  React.useEffect(() => {
    if (mapClicked) {
      navigate('/exploration')
    }
  }, [mapClicked, navigate])

  function mouseMove(point: any): void {
    if (point.features[0] !== undefined) {
      const newPoint = point.features[0] as queriedFeatures
      setHoverInfo({
        name: newPoint.properties.name,
        progress: newPoint.properties.progress,
        total: newPoint.properties.total,
        percentage: newPoint.properties.percentage
      })

    }
  }

  function findNearestPoint(point: MapLayerMouseEvent) {
    const turfPoint = turf.point([point.lngLat.lng, point.lngLat.lat])
    var closePoint: any
    if (hoverInfo.name !== '') {
      for (var i = 0; i < turfStreetPoints.length; i++) {
        //console.log(hoverInfo)
        if (hoverInfo.name == turfStreetPoints[i].name) {
          closePoint = nearestPoint(turfPoint, turfStreetPoints[i].points)
          console.log(closePoint)
          //closePoint = nearestPoint(turfPoint,turfStreetPoints[0].points)
          updateGoogleMapConfig({ position: { lat: closePoint.geometry.coordinates[1], lng: closePoint.geometry.coordinates[0] } })
          setMapClicked(true)
          return
        }
      }
    }
  }

  function pointsToFeatureCollection(): turfFeatureCollection[] {
    var sp = require("./contestStreets.json")
    var turfStreetPoints: turfFeatureCollection[] = [];
    sp.map((neighborhoods: any, index: number) => {
      var spPoints: Feature<Point, GeoJsonProperties>[] = [];
      neighborhoods.locations.map((locations: any) =>
        spPoints.push(turf.point([locations.lng, locations.lat]))
      )

      turfStreetPoints.push({ name: neighborhoods.name, points: turf.featureCollection(spPoints) })
    }
    )
    //console.log(turfStreetPoints)
    return turfStreetPoints
  }

  function onMouseLeave() {
    setHoverInfo(defaultHoverInfo)
    //@ts-ignore
    setLayerStyle({ ...layerStyle, paint: { "line-color": "#000000", "line-width": 0 } })
  }

  function renderMap() {

    return (
      <Map
        initialViewState={{
          bounds: llb
        }}
        style={{ width: '100%', height: '87vh', zIndex: 0 }}
        mapStyle="mapbox://styles/tort8678/clei1xklm001z01p1ififm6hx"
        styleDiffing
        mapboxAccessToken={process.env.REACT_APP_MAPBOX_TOKEN as string}
        interactive={false}
        interactiveLayerIds={["contest-map1"]}
        onClick={(e) => findNearestPoint(e)}
        onMouseMove={(e) => mouseMove(e)}
        //onMouseLeave={onMouseLeave}
      >

        <Source id='border' type='geojson' data={drawnFeatures}>
          <Layer {...layerStyle} />
        </Source>
        <Typography variant="subtitle1" color="text.primary" position='absolute' zIndex={1} fontSize={18}>Your Total Score: {contestScore}</Typography>

        <Grid container spacing={2} maxWidth={100} rowSpacing={.005} sx={gridSX}>
          <Grid item xs={12}><div><b>Percentage</b></div></Grid>
          {Array.from(Array(legend.colors.length)).map((_, index) => (
            <Grid item xs={12} key={index}>
              <Item ><CircleIcon htmlColor={legend.colors[index]} sx={{ fontSize: 15, top: 0 }}></CircleIcon> {legend.layers[index]}</Item>
            </Grid>
          ))}
        </Grid>
      </Map>
    )
  }

  return (
    <Container maxWidth='xl' sx={{ pt: 4, pb: 4 }}>
      <Grid container>

        <Grid item xs={4}>
        <Typography variant="h6" sx={{ml:3}}><b>Current Area:</b> {hoverInfo.name}</Typography>
          <ContestAreaInfo areaName={hoverInfo.name}></ContestAreaInfo>
          {/*
          <Grid container spacing={0} columnSpacing={0} rowSpacing={5} sx={{pt:'10%'}}>
            <Grid item xs={8}>
              <Typography variant='subtitle1' fontWeight='bold'>Neighborhood Name:</Typography>
            </Grid>
            <Grid item xs={4}>
            <Typography variant='subtitle1' >{hoverInfo.name}</Typography>
            </Grid>
            <Grid item xs={8}>
              <Typography variant='subtitle1' fontWeight='bold'>Your Area Score:</Typography>
            </Grid>
            <Grid item xs={4}>
            <Typography variant='subtitle1'>{hoverInfo.name === "" ? "" : "0"}</Typography>
            </Grid>
            <Grid item xs={8}>
              <Typography variant='subtitle1' fontWeight='bold'>Percent Owned:</Typography>
            </Grid>
            <Grid item xs={4}>
            <Typography variant='subtitle1'>{hoverInfo.name === "" ? "" : "0%"}</Typography>
            </Grid>
            <Grid item xs={8}>
              <Typography variant='subtitle1' fontWeight='bold'>Current Owner:</Typography>
            </Grid>
            <Grid item xs={4}>
            <Typography variant='subtitle1'>{hoverInfo.name === "" ? "" : "n/a"}</Typography>
            </Grid>
            <Grid item xs={8}>
              <Typography variant='subtitle1' fontWeight='bold'>Ownership Bonus:</Typography>
            </Grid>
            <Grid item xs={4}>
            <Typography variant='subtitle1'>{hoverInfo.name === "" ? "" : "500 points"}</Typography>
            </Grid>
            <Grid item xs={8}>
              <Typography variant='subtitle1' fontWeight='bold'>Percentage Completed:</Typography>
            </Grid>
            <Grid item xs={4}>
            <Typography variant='subtitle1'>{hoverInfo.name === "" ? "" : hoverInfo.percentage+"%"}</Typography>
            </Grid>
          </Grid>
  */}
        </Grid>
        <Grid item xs={8}>
          <Box sx={{ border: '3px solid grey' }}>
            {renderMap()}
          </Box>
        </Grid>


      </Grid>
    </Container>
  )
}
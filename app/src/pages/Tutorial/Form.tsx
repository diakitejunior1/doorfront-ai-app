import React from 'react'
import {Box,  Tab, Typography, Tabs, Container} from '@mui/material'
import YoutubeEmbed from './YoutubeEmbed';
import { useState,} from "react";
import {Intro, Junior, Pivot, Ramdom, Validate, Labeling, Panels} from './Images';
import Navbar from '../../components/Navbar';


export default function Form() {
 
  const [value,setValue]= useState(0)
  const handleChange= ( event:  React.SyntheticEvent, newValue: number) => {
    // console.warn(newValue)
    setValue(newValue)
  }
  return(

    <div >
       <Navbar/>
      <Container sx={{display: "flex", flexDirection: 'row', width: '100%'}}>

   <Box ml={-7} >
      <Tabs  value={value}
            onChange={handleChange}         
            orientation='vertical'
            >
          <Tab label="Introduction" />
          <Tab label=" how to explore nyc" />
          <Tab label="how to label storfronts" /> 
          <Tab label="how validate labels"/>
       
      </Tabs>   
 
    </Box>
    <Box ml={2}>
       <TabPanel value={value} index={0} >  
       <Typography sx={{ mb: 2, mr: 20, textAlign: "left" }} >
            <Typography>
            <Typography variant="h5" sx={{ mb: 2, textAlign: "left" }}>Introduction</Typography> 
            Doorfront uses a crowsorsing method to obtain data required to help software programers build
            Softwares that will improve traveling for visually impaired people. The data collected via dorfront are
            doors, stairs, ramps, doorknobs. Any one is welcome to use doorfront for a new meaningful cause
           With DoorFront, you can virtually walk through the entire city of New
            York while you can collect accessible storefront. The work you do
            helps not only the community, but the city as a whole.</Typography>
            <Intro />
            
            <Typography variant="h5" sx={{ mb: 2, textAlign: "left" }}>Badge and Ranking System</Typography> 
            As collecting accessible storfront with dorrfront, you are helping the community, therefore doorfront
            has a credits mechanism for community services.
            <Typography> Query image: add 1 point</Typography> 
            <Typography> Correct(Modify) other's labels: add 1 point</Typography>
            <Typography> Validate other's labels: add 1 point</Typography>
          <Typography>   Find treasures: add 10 pointsQuery image: add 1 point</Typography>

            Friendly reminder: DoorFront has buried many treasures in New York
            City, find them and earn extra points. The more pictures you query,
            the better your chances of finding the treasure. Take action,
            adventurers!
                </Typography>
      </TabPanel> 
  
      <TabPanel value={value} index={1}> 
          <Typography variant="h5" sx={{ mb: 2, textAlign: "left" }}>How to use the arrow feature</Typography> 
            <Typography>
              The arrow has its heads oriented to different direction in Google street View, going left and right or forward and backward.
              In the middle of block, the arrow has only 2 heads. At the intersection, the arrow has 4 heads pointed to 
              each direction left/right/forward/backward. So, if one want to change the street with the arrow feature
              you just need to push it to the intersection.
            </Typography>
            <Junior />
            <Typography variant="h5" sx={{ mb: 2, textAlign: "left" }}>How to use drag/drop feature</Typography>
            <Typography>  (Text instruction for drag/drop controle to quickly move will go here) 
              If one want to quick move to a specific position on the map, you can use the drag/drop feature to move 
              on the map and view the accessibility objects on that are of the map. you can drag the pivot on the map
             and drop it any area on the map and Google streetView will take you there and you can view the images of that area 
            </Typography>
            <Pivot />
           <Typography variant="h5" sx={{ mb: 2, textAlign: "left" }}> How To Ramdomly Change Street View Location </Typography>
            <Typography>(Text instructions will go here) If one wish to Ramdomly change its current location in google streetv view.
               There is a command at the right corner on the bottom on the exploration page called "Change street view location".
               Pressing this command will instantly change the starting point of google street view to a different location. 
            </Typography>
            <Ramdom />
            <Typography variant="h5" sx={{ mb: 2, textAlign: "left" }}>Video of Instructions:</Typography>
            <Typography> This video tap shows in recording how both features are used
            to successfully explore the city. what's better than visualizing the instructions in action? 
            </Typography>
            <YoutubeEmbed embedId="ShRXV4JkgSE" />
      </TabPanel>

        <TabPanel value={value} index={2}>
            <Typography variant="h5" sx={{ mb: 2, textAlign: "left" }}>Step 1 Capture storefront</Typography>
            <Typography>
           Within the exploration page of doorfront, you can explore the city with Google Street View. To capture a storefront,
           You can position your Google Street View such that you have a better position for screenshot of the storefronts, 
           make sure all the accessibility object are visible on the screen, and then click on the button called 
           "Capture current image & AI label" located on the right botom of your screen in exploration page.  
           Once, image captured doorfront has an AI label system that will automatically identify all the accessibility objects 
           on the image and label them. However, user should go to labeling page to edit and confirm the AI labels since the AI label
            can wrongly label some data. 
           </Typography>
           <Typography variant="h5" sx={{ mb: 2, textAlign: "left" }}>Step 2 edit and confirm AI labels </Typography>
           <Typography>
          To access the AI labels on the current captured images, User can click on the button "edit and confirm AI labels"
          below the button "Capture current image & AI label" to open the labeling page. User can also capture more than one images, 
          carry them to the labeling page at once to edit and confirm the AI labels on these images. 
           </Typography>

             <Labeling />
            <Typography>
            Once, user open the labeling page, doorfront offert several tools to user to propertly edit and confirm all the labels. 
            </Typography>
            <Typography>
            User have the option to resize the image and user have the option to switch image
            </Typography >
             <Typography>
            On the left side of the screen, user can click and open image panel where user can browse queried images.
            </Typography>
            <Typography>
            Click and open label panel where user can browse all labels within an image and submit the labels.
            </Typography>
            <Typography>
            Click and open the Box panel where user can select the type of box for specific object type to draw on the 
            image.
            </Typography>
            <Panels />

            <Typography sx={{ mb: 2, mr: 20, textAlign: "left" }} >
              <Typography variant="h6">
                Keyboard:
              </Typography>
              Press q to quit the labeling mode 
              Press d to delete selected bounding box
              Press c to duplicate selected bounding box
              </Typography>
              <Typography variant="h5" sx={{ mb: 2, textAlign: "left" }}>Video of Instructions</Typography>

              <YoutubeEmbed embedId="ikGT8IHEAJ4" />
          </TabPanel>
        <TabPanel value={value} index={3}>
        <Typography sx={{ mb: 2, mr: 20, textAlign: "left" }} >
          As previously stated, doorfront offers AI labeling feature of query images once once they are capture from Google Street View
          However, these labels are not always accurrate, either some accessibility objects are left out of being label or some
          are wrongly labeled. So, doorfront offers additional point for user who takes time to retrieve labels that had being already labeled submitted
          to validate them, meaning check and fixed the mistakes if necessary.
          </Typography> 
           
          <Typography>
          <Typography variant="h5" sx={{ mb: 2, textAlign: "left" }}> How to find submitted labels </Typography>
          <Typography>
          Inside of any page of doorfront, there is a button on the navbar located at the top right side of the
          screen called "Validate Labels". When you click on the "Validate Labels", this open up an interface where user 
          go through the images that have been already labels and submitted. So, users can over look over other users work to fix
          mistakes they have made or missed. 
          2 you can also encounter storefronts that have been already collecting while you are exploring the city google street view
          in doorfront. The pictures bellow show you how a labeled storefront looks like in GSV vs How a no labeles storefronts look like.
          </Typography>
          <Validate />
         </Typography> 
         
        </TabPanel>  


        </Box>
 </Container>
  </div>
  )}


 interface TabPanelProps {

  children?: React.ReactNode;
  index: number;
  value: number;
}
    function TabPanel( props: TabPanelProps)
  {
    
    const {children, value, index, ...other } = props
  
    return(
      <div {...other}>
        {
        
          value==index && (
            <h1>{children}</h1>
          )
        }
     
        
        
      </div>
    )
  }


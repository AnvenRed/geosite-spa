import React, {Component} from 'react';
import * as locations from './location_data/locations.json';

//https://github.com/uber/react-map-gl
import ReactMapGL, { Marker, NavigationControl, FlyToInterpolator } from "react-map-gl";
import DeckGL, { GeoJsonLayer } from "deck.gl";

//from https:github.com/SamSamskies/react-map-gl-geocoder
import Geocoder from 'react-map-gl-geocoder'
import 'react-map-gl-geocoder/dist/mapbox-gl-geocoder.css'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons'

//from https://reactjsexample.com/react-side-nav-component/
import '@trendmicro/react-sidenav/dist/react-sidenav.css';
import SideNav, { Toggle, Nav, NavItem, NavIcon, NavText } from '@trendmicro/react-sidenav';

class Map extends Component {
  constructor(props) {
    super(props);
    this.state = {
      viewport: {
        width: "100vw",
        height: "100vh",
        latitude: 37.0902,
        longitude: -95.7129,
        zoom: 3
      }
    };
  }

  mapRef = React.createRef()

  onViewportChange = viewport => {
        this.setState({viewport});
  };

  //next two functions are from https:github.com/SamSamskies/react-map-gl-geocoder
  // handleOnResult = event => {
  //   this.setState({
  //     searchResultLayer: new GeoJsonLayer({
  //       id: "search-result",
  //       data: event.result.geometry,
  //       getFillColor: [255, 0, 0, 128],
  //       getRadius: 1000,
  //       pointRadiusMinPixels: 10,
  //       pointRadiusMaxPixels: 10
  //     })
  //   });
  // };

  //https:github.com/SamSamskies/react-map-gl-geocoder
  handleGeocoderViewportChange = (viewport) => {
    const geocoderDefaultOverrides = { transitionDuration: 1000 }

    return this.onViewportChange({
      ...viewport,
      ...geocoderDefaultOverrides
    })
  }


  goTo(coordinates,zoom) {
          const viewport = {
              ...this.state.viewport,
              latitude: coordinates[0],
              longitude: coordinates[1],
              zoom: zoom,
              transitionDuration: 2000,
              transitionInterpolator: new FlyToInterpolator(),
          };
          this.setState({viewport});
    };

  render() {

    return (
      <div>
        <SideNav
          onSelect={(selected) => {
            if (selected==="country"){
              this.goTo([37.0902,-95.7129],3)
            }
            else if(selected==="city/raleigh"){
              this.goTo([35.7796,-78.6382],10);
            }
            else if (selected==="city/houston"){
              this.goTo([29.7604,-95.3698],10);
            }
            else if (selected==="city/phoenix"){
              this.goTo([33.4484,-112.0740],10);
            }
            else if (selected==="work/raleigh"){
              this.goTo(locations.locations[0].latlng,14);
            }
            else if (selected==="work/phoenix"){
              this.goTo(locations.locations[4].latlng,14);
            }
            else if (selected==="residences/former/raleigh"){
              this.goTo(locations.locations[1].latlng,14);
            }
            else if (selected==="residences/current"){
              this.goTo(locations.locations[2].latlng,14);
            }
            else if (selected==="residences/former/houston"){
              this.goTo(locations.locations[3].latlng,14);
            }
          }}
          >
         <SideNav.Toggle />
          <SideNav.Nav defaultSelected="country">
            <NavItem eventKey="country">
              <NavIcon>
                USA
              </NavIcon>
            </NavItem>
            <NavItem eventKey="city">
              <NavIcon>
                City
              </NavIcon>
              <NavItem eventKey="city/raleigh">
                <NavText title="Raleigh">
                  Raleigh
                </NavText>
              </NavItem>
              <NavItem eventKey="city/houston">
                <NavText title="Houston">
                  Houston
                </NavText>
              </NavItem>
              <NavItem eventKey="city/phoenix">
                <NavText title="Phoenix">
                  Phoenix
                </NavText>
              </NavItem>
            </NavItem>
            <NavItem eventKey="work">
              <NavIcon>
                Work
              </NavIcon>
                <NavItem eventKey="work/raleigh">
                  <NavText title="Infosys">
                    Infosys (Raleigh)
                  </NavText>
                </NavItem>
                <NavItem eventKey="work/phoenix">
                  <NavText title="Amex">
                    American Express (Phoenix)
                  </NavText>
                </NavItem>
            </NavItem>
            <NavItem eventKey="residences">
              <NavIcon>
                  Home
              </NavIcon>
                <NavItem eventKey="residences/current">
                  <NavText title="Current">
                    Current
                  </NavText>
                </NavItem>
                <NavItem eventKey="residences/former/raleigh">
                  <NavText title="Former">
                    Former (Raleigh)
                  </NavText>
                </NavItem>
                <NavItem eventKey="residences/former/houston">
                  <NavText title="Former">
                    Former (Houston)
                  </NavText>
                </NavItem>
            </NavItem>
          </SideNav.Nav>
      </SideNav>
      <ReactMapGL
        ref={this.mapRef}
        {...this.state.viewport}
        mapboxApiAccessToken={"pk.eyJ1IjoiYXZwaWxsdXRsYSIsImEiOiJjazB4enlnaWgwYmZxM2JtaXE4dGViMDVqIn0.zro-GAN4TlcsBK1UGZ8G0g"}
        mapStyle="mapbox://styles/avpillutla/ck0y1mbo6000k1cpw7zvt8694"
        onViewportChange={(viewport) => this.setState({viewport})}
      >
        <Geocoder
            mapRef={this.mapRef}
            onViewportChange={this.handleGeocoderViewportChange}
            mapboxApiAccessToken={"pk.eyJ1IjoiYXZwaWxsdXRsYSIsImEiOiJjazB4enlnaWgwYmZxM2JtaXE4dGViMDVqIn0.zro-GAN4TlcsBK1UGZ8G0g"}
            position="top-right"
        />
        <div className="nav" style={styles.navigation}>
          <NavigationControl/>
        </div>

      {locations.locations.map(location => (
          <Marker
            key={location.name}
            latitude={location.latlng[0]}
            longitude={location.latlng[1]}
          >
            <button
              className="marker-btn"
              onClick={this.goTo.bind(this,location.latlng,10)}
            >
              <FontAwesomeIcon icon={faMapMarkerAlt} />
            </button>
          </Marker>
        ))}
      </ReactMapGL>
      </div>
    );
  }
}
const styles = {
  navigation: {
    position: 'absolute',
    top: 100,
    right: 0,
    padding: '10px'
  }
};

export default Map;

import React from 'react';
import GoogleMap from '../GoogleMap/GoogleMap';
import loadGoogleMaps from '../../utils/map';

const MapsComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = { googleMapsReady: false };
    }

    componentWillMount() {
        loadGoogleMaps(() => {
          // Work to do after the library loads.
            this.setState({ googleMapsReady: true });
        });   
    }

    render() {
        return (
            <div className="MapsComponent">
                {this.state.googleMapsReady ? <GoogleMap /> : ''}
            </div>
        );
    }
}
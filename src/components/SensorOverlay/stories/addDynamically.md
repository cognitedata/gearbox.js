## Add Sensors Dynamically

<!-- STORY -->

#### Usage:

```typescript jsx
import 'antd/dist/antd.css';

import React from 'react';
import { SensorOverlay } from '@cognite/gearbox';
import { timeseriesList } from './timeseriesList'; // sample list of timeseries 

class ExampleComponent extends React.Component {
  state = {
    counter: 0,
    timeserieIds: [],
  };
  render() {
    return (
      <div>
        <button
          style={{ marginBottom: 20 }}
          onClick={() =>
            this.setState({
              timeserieIds: [
                ...this.state.timeserieIds,
                timeseriesList[this.state.counter].id,
              ],
              counter: this.state.counter + 1,
            })
          }
        >
          Add Sensor
        </button>
        <SensorOverlay timeserieIds={this.state.timeserieIds}>
          <div
            style={{
              width: '100%',
              height: '300px',
              background: '#EEE',
            }}
          />
        </SensorOverlay>
      </div>
    );
  }

}
```

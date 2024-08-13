import React, { useEffect, useState } from 'react'

import FlowBuilder from './flowBuilder'

import { FlowService } from '../../services/flowService'

export default function FlowView() {
    const flowService = new FlowService();

    const [flowAvailabilityConfig, setFlowAvailabilityConfig] = useState({});

    useEffect(() => {
        flowService.get_availability_config()
        .then((response) => {
            if (response.success) {
                setFlowAvailabilityConfig(response);
            }
        })
    }, []);

  return (
    <div style={{ width: '100vw', height: '100vh' }}>
        <FlowBuilder />
    </div>
  )
}

import React from 'react';

import { Grid } from '@mui/material';

import ConsoleListItem from './ConsoleListItem';

export default function ConsoleList(props) {
    const {
        items,
    } = props;

    return (
        <Grid
            xs={5}
        >
            {
                items && items.length > 0 &&
                items.map((item) => {
                    const title = item.title;
                    const fields = item.fields;
                    const actions = item.actions;

                    return (
                        <ConsoleListItem
                            title={title}
                            fields={fields}
                            actions={actions}
                        />
                    )
                })
            }
        </Grid>
    )
}

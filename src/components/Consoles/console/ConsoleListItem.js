import React from 'react'

import { 
    Card, CardHeader, CardContent, Typography 
} from '@mui/material';


export default function ConsoleListItem(props) {
    const {
        title,
        fields,
        actions
    } = props;

    return (
        <Card>
            <CardHeader 
                title={title}
                action={
                    actions
                }
            />
            <CardContent>
                {
                    fields.map((field) => {
                        const fieldTitle = field.title;
                        const fieldValue = field.value;

                        return (
                            <Typography>{fieldTitle} - {fieldValue}</Typography>
                        )
                    })
                }
            </CardContent>
        </Card>
    )
}



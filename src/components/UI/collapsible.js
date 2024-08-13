import React from 'react';

import {
    Accordion, AccordionSummary, AccordionDetails,
    Card, CardHeader, IconButton,
} from '@mui/material';

import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import theme from '../../Theme';

export default function Collapsible(props) {
    const {
        embeddedComponent,
        title,
        action,
        last,
    } = props;

    return (
        <Card
            sx={{
                backgroundColor: theme.palette.background.secondary,
                backdropFilter: "blur(5px)",
                margin: last ? "0" : "0 0 0.5em",
            }}
        >
            <Accordion
                sx={{
                    backgroundColor: theme.palette.background.secondary,
                    backdropFilter: "blur(5px)"
                }}
            >
                <AccordionSummary
                    sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                    }}
                    expandIcon={
                        <IconButton
                            sx={{
                                color: 'white',

                                '&:hover': {
                                    color: 'black',
                                    background: 'white',
                                    transition: '0.2s ease-in-out',
                                },
                            }}
                        >
                            <ExpandMoreIcon />
                        </IconButton>
                    }
                >
                    <CardHeader
                        title={title}
                        titleTypographyProps={{
                            variant: 'h6'
                        }}
                        sx={{
                            padding: 0,
                            color: 'white',
                            width: '100%',
                        }}
                        action={
                            action
                        }
                    >
                    </CardHeader>
                </AccordionSummary>
                <AccordionDetails
                    sx={{
                        backgroundColor: theme.palette.background.secondary,
                        backdropFilter: "blur(5px)",
                    }}
                >
                    {embeddedComponent}
                </AccordionDetails>
            </Accordion>
        </Card>
    )
}



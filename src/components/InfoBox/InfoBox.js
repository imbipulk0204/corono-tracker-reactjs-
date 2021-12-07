import React from 'react';
import { Card,Typography,CardContent } from '@material-ui/core';

const Infobox = ({title,cases,total}) => {
    return (
        <Card>
            <CardContent>
                {/* title */}
                <Typography color="textSecondary" className="infoBox__title">
                    {title}
                </Typography>
                {/* Number of cases */}
                <h2 className="infoBox__cases">{cases}</h2>

                {/* 1.2M total */}
                <Typography color="textSecondary" className="infoBox__total">
                    {total} Total
                </Typography>
            </CardContent>
        </Card>
    );
}

export default Infobox;

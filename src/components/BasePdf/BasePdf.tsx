import { makeStyles, IconButton } from '@material-ui/core'
import React from 'react'
import { Document, Page } from "react-pdf";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import ArrowForwardIcon from "@material-ui/icons/ArrowForward";
import { baseStyle } from 'theme';

interface Props {
    mainDataBlobUrl: string;
    isBlackByIconButtonColor?: boolean;
}

export const BasePdf = ({mainDataBlobUrl, isBlackByIconButtonColor}: Props) => {
    const classes = useStyles();
    const [pdfPagesNum, setPdfPagesNum] = React.useState(0);
    const [pdfCurrentPageNum, setPdfCurrentPageNum] = React.useState(1);

    const handleClickBackIcon = () => {
        if (pdfCurrentPageNum === 1) {
            setPdfCurrentPageNum(pdfPagesNum);
        } else {
            setPdfCurrentPageNum((prev) => prev - 1);
        }
    };

    const handleClickForwardIcon = () => {
        if (pdfCurrentPageNum === pdfPagesNum) {
            setPdfCurrentPageNum(1);
        } else {
            setPdfCurrentPageNum((prev) => prev + 1);
        }
    };

    const PdfPages = [];
    for (let i = 1; i <= pdfPagesNum; i += 1) {
        PdfPages.push(
            <Page
                key={i}
                className={`${classes.pdfPage} ${i === pdfCurrentPageNum ? classes.pdfPageDisplayFlex : ""
                    }`}
                pageNumber={i}
            />
        );
    }

    return (
        <>
            <Document className={classes.pdfDocument} file={mainDataBlobUrl} onLoadSuccess={({ numPages }) => {
                setPdfPagesNum(numPages)
            }}>
                {PdfPages}
            </Document>
            <div className={classes.pdfButtonArea}>
                <IconButton className={`${classes.iconButtonWhiteColorHover} ${isBlackByIconButtonColor&&classes.iconButtonGray}`} onClick={handleClickBackIcon}>
                    <ArrowBackIcon className={`${classes.colorWhite} ${isBlackByIconButtonColor&&classes.colorBlack}`} />
                </IconButton>
                <div>
                    <p className={`${isBlackByIconButtonColor ? classes.colorBlack : classes.colorWhite}`}>
                        {pdfCurrentPageNum} / {pdfPagesNum}
                    </p>
                </div>
                <IconButton className={`${classes.iconButtonWhiteColorHover} ${isBlackByIconButtonColor&&classes.iconButtonGray}`} onClick={handleClickForwardIcon}>
                    <ArrowForwardIcon className={`${classes.colorWhite} ${isBlackByIconButtonColor&&classes.colorBlack}`} />
                </IconButton>
            </div>
        </>
    )
}

const useStyles = makeStyles({
    pdfDocument: {
        position: "relative",
        height: "calc(100% - 50px)",
      },
    pdfPage: {
        overflow: "hidden",
        width: "100%",
        display: "none"
    },
    pdfPageDisplayFlex: {
        display: "flex",
    },
    pdfButtonArea: {
        width: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        gap: "20px",
        padding: "5px",
        bottom: 0,
    },
    iconButtonWhiteColorHover: {
        "&:hover": {
            backgroundColor: "rgba(255, 255, 255, 0.15)",
        },
    },
    iconButtonGray: {
        backgroundColor: "rgba(0, 0, 0, 0.05)",
        "&:hover": {
          backgroundColor: "rgba(0, 0, 0, 0.14)",
        },
    },
    colorWhite: {
        color: baseStyle.color.white.light,
    },
    colorBlack: {
        color: baseStyle.color.black.main,
    },
})
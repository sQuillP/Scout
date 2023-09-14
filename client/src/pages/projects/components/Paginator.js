import { Stack, IconButton, Tooltip, } from "@mui/material"

import { ArrowBackIos, ArrowForwardIos } from "@mui/icons-material"

import "../styles/ProjectHome.css";

export default function Paginator({
    handlePaginatedResults, 
    totalItems, 
    resultsPerPage, 
    currentPage,
    handleResultsPerPage
}) {


    return (
        <div className="pt-pagination">
            <div className="pagination-item">
                <label htmlFor="_page-selector">Number of items</label>
                <select 
                    onChange={handleResultsPerPage} 
                    name="pt-selector" 
                    id="_page-selector"
                    className="pagination-select"
                    value={resultsPerPage}
                >
                    <option value="5">5</option>
                    <option value="10">10</option>
                    <option value="20">20</option>
                    <option value="50">50</option>
                </select>
            </div>
            <div className="pagination-item">
                <p className="text">{(currentPage-1)*resultsPerPage +1} - {Math.min(currentPage*resultsPerPage,totalItems)} of {totalItems} </p>
                <div>
                    <Tooltip title="Previous page">
                        <IconButton 
                            onClick={()=> handlePaginatedResults(-1)} 
                            size='small'
                            sx={{ opacity:currentPage === 1 ? 0.5: 1}}
                            disabled={currentPage === 1}
                        >
                            <ArrowBackIos htmlColor="white" fontSize="0.7em"/>
                        </IconButton>
                    </Tooltip>
                    <Tooltip title='Next Page'>
                        <IconButton 
                            onClick={()=> handlePaginatedResults(1)} 
                            size="small"
                            disabled={totalItems <= currentPage*resultsPerPage}
                            sx={{opacity: totalItems <= currentPage*resultsPerPage? 0.5:1}}
                        >
                            <ArrowForwardIos htmlColor="white" fontSize="0.7em"/>
                        </IconButton>
                    </Tooltip>
                </div>
            </div>
        </div>
    )
}

/**
 * 
 *  <div className="ph-invitations-paginator">
            <Stack
                justifyContent={'flex-end'}
                direction={'row'}
            >

                <div className="pagination-item">
                    <label htmlFor="_invite_paginator">Number of items</label>
                    <select name="" className="pagination-select" id="_invite_paginator">
                        <option value="5">5</option>
                        <option value="10">10</option>
                        <option value="15">15</option>
                    </select>
                </div>
                <div className="pagination-item">
                    <p className="text">{(currentPage-1)*itemsPerPage +1} - {Math.min(currentPage*itemsPerPage,totalItems)} of {totalItems} </p>
                    <div>
                        <Tooltip title="Previous page">
                            <IconButton 
                                onClick={()=> handlePagination(-1)} 
                                size='small'
                                sx={{ opacity:currentPage === 1 ? 0.5: 1}}
                                disabled={currentPage === 1}
                            >
                                <ArrowBackIos htmlColor="white" fontSize="0.7em"/>
                            </IconButton>
                        </Tooltip>
                        <Tooltip title='Next Page'>
                            <IconButton 
                                onClick={()=> handlePagination(1)} 
                                size="small"
                                disabled={totalItems <= currentPage*itemsPerPage}
                                sx={{opacity: totalItems <= currentPage*itemsPerPage? 0.5:1}}
                            >
                                <ArrowForwardIos htmlColor="white" fontSize="0.7em"/>
                            </IconButton>
                        </Tooltip>
                    </div>
                </div>
            </Stack>
        </div>
 * 
 */
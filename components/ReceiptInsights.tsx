import { FormControl, InputLabel, MenuItem, Select, Skeleton, ToggleButton, ToggleButtonGroup } from '@mui/material'
import React, { useCallback, useEffect, useState } from 'react'
import styled from 'styled-components'
import PieChart from './PieChart'

const Container = styled.div`
    font-size: 1rem;
    text-align: left;
    border: 1px solid black;
    padding: 0.8rem;
    max-width: 400px;
    width: 400px;
`

const Header = styled.div`
    font-size: 1.2rem;
`

const Content = styled.div``

const Options = styled.div`
    margin-top: 0.8rem;
    display: flex;
    justify-content: space-between;
`

const ReceiptSelect = styled(Select)`
    min-width: 200px;
`

const ChartContainer = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    height: 300px;
`

const ProcessingError = styled.div`
    color: red;
`

const ReceiptPathsEnum = {
    COSTCO: 'COSTCO',
    WALGREENS: 'WALGREENS',
}

const ReceiptPaths = {
    [ReceiptPathsEnum.COSTCO]: {
        path: './receipts/costco.jpg',
        label: 'Costco'
    },
    [ReceiptPathsEnum.WALGREENS]: {
        path: './receipts/walgreens.jpeg',
        label: 'Walgreens'
    }
}

const ValueTypes = {
    COST: 'COST',
    QUANTITY: 'QUANTITY',
}

export default function ReceiptInsights () {
    const [receiptPath, setReceiptPath] = useState(ReceiptPathsEnum.COSTCO)
    const [valueType, setValueType] = useState(ValueTypes.COST)
    const [lineItems, setLineItems] = useState([])
    const [data, setData] = useState(null)
    const [dataLoading, setDataLoading] = useState(true)
    const [processingError, setProcessingError] = useState('')

    const processDocument = useCallback(async () => {
        setDataLoading(true)
        fetch('/api/processReceipt?' + new URLSearchParams({ path: ReceiptPaths[receiptPath].path })).then((response) => {
            if (response.status === 200) {
                return response.json()
            } else throw Error(`Unable to process the receipt. Failed with error code ${response.status}`)
        })
        .then((data) => {
            const lineItems = JSON.parse(data.message)
            setLineItems(lineItems)
            setDataLoading(false)
            setProcessingError('')
        }).catch((e: Error) => {
            setDataLoading(false)
            setData(null)
            setProcessingError(e.message)
            setLineItems([])
        })
    }, [receiptPath])

    useEffect(() => {
        setData(Object.entries(lineItems.reduce((res, lineItem) => {
            if (res[lineItem.type]) {
                res[lineItem.type] += valueType === ValueTypes.COST ? lineItem.total : lineItem.quantity
            } else {
                res[lineItem.type] = valueType === ValueTypes.COST ? lineItem.total : lineItem.quantity
            }
            return res
        }, {})).map(([label, value]) => ({ label, value })))
    }, [valueType, lineItems])

    useEffect(() => {
        processDocument()
    }, [processDocument])

    return (
        <Container>
            <Header>Receipt Insights</Header>
            <Content>
                <Options>
                    <FormControl>
                        <InputLabel>Receipt Image</InputLabel>
                        <ReceiptSelect
                            labelId="demo-simple-select-disabled-label"
                            id="demo-simple-select-disabled"
                            value={receiptPath}
                            label="Receipt Image"
                            onChange={(e) => setReceiptPath(e.target.value as string)}
                        >
                            <MenuItem value={ReceiptPathsEnum.COSTCO}>{ReceiptPaths[ReceiptPathsEnum.COSTCO].label}</MenuItem>
                            <MenuItem value={ReceiptPathsEnum.WALGREENS}>{ReceiptPaths[ReceiptPathsEnum.WALGREENS].label}</MenuItem>
                        </ReceiptSelect>
                    </FormControl>
                    <ToggleButtonGroup
                        color="primary"
                        value={valueType}
                        exclusive
                        onChange={(_, value) => setValueType(value)}
                        aria-label="Aggregate by"
                    >
                        <ToggleButton value={ValueTypes.COST}>Cost</ToggleButton>
                        <ToggleButton value={ValueTypes.QUANTITY}>Quantity</ToggleButton>
                    </ToggleButtonGroup>
                </Options>
                <ChartContainer>
                {!dataLoading && data
                    ? <PieChart data={data} outerRadius="100" innerRadius="50"/>
                    : (
                            <Skeleton
                                sx={{ bgcolor: '#ddd' }}
                                variant="circular"
                                width={200}
                                height={200}
                            />
                            )
                        }
                </ChartContainer>
                {processingError && <ProcessingError>{processingError}</ProcessingError>}
            </Content>
        </Container>
    )
}
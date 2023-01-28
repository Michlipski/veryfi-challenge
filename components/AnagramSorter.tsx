import { TextField } from '@mui/material'
import React, { useEffect, useState } from 'react'
import styled from 'styled-components'

const Container = styled.div`
    font-size: 1rem;
    text-align: left;
    border: 1px solid black;
    padding: 0.8rem;
    max-width: 400px;
    width: 400px;
`

const Error = styled.div`
    color: red;
`

const Header = styled.div`
    font-size: 1.2rem;
`

const InputList = styled(TextField)`
    width: 100%;
    && {
        margin: 0.8rem 0;
    }
`

export default function AnagramSorter () {
    const [inputList, setInputList] = useState([])
    const [inputError, setInputError] = useState('')
    const [sortedList, setSortedList] = useState('[]')

    const handleOnInputChange = (e) => {
        let parsedInput = []
        if ((e?.target?.value ?? '') === '') {
            setInputError('')
            return
        }
        try {
            parsedInput = JSON.parse(e.target.value)
            if (!Array.isArray(parsedInput)) {
                setInputError('The input is not a stringified JSON list')
            }
            if (!parsedInput?.every((el) => typeof el === 'string')) {
                setInputError('Not every element of the list is a string')
            }
            setInputError('')
        } catch (e) {
            // console.log(e)
           setInputError('The input value is not a valid stringified JSON list of strings') 
        } finally {
            setInputList(parsedInput)
        }
    }

    useEffect(() => {
        const hashMappedAnagrams = inputList.reduce((hashMap, nextInput) => {
            const key = nextInput.split('').sort().join('')
            if (hashMap[key]) hashMap[key].push(nextInput)
            else hashMap[key] = [nextInput]
            return hashMap
        }, {})
        setSortedList(JSON.stringify(Object.values(hashMappedAnagrams)))
    }, [inputList])

    return (
        <Container>
            <Header>Anagram Sorter</Header>
            <InputList label="Input" placeholder='Paste your unsorted anagram list here e.g. ["ab", "ba"]' onChange={handleOnInputChange} />
            {inputError && <Error>{inputError}</Error>}
            <div>Result: {sortedList}</div>
        </Container>
    )
}